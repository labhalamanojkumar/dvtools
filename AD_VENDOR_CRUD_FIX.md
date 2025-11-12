# Ad Vendor Edit, Deactivate, and Delete Fix

## Problem
After adding ad vendors in `/admin/ads`, the edit, deactivate, and delete functions were not working:
- **Edit button**: Opened dialog but didn't populate form fields or save changes
- **Deactivate button**: Worked correctly (already implemented)
- **Delete button**: Had no onClick handler, did nothing when clicked

## Root Causes

1. **Missing `updateVendor` function**: No PUT request handler for editing vendors
2. **Missing `deleteVendor` function**: No DELETE request handler  
3. **Form not populated on edit**: No logic to fill form fields with existing vendor data
4. **Wrong button handler**: "Create Vendor" button always called `createVendor()` even in edit mode
5. **Delete button not wired**: Dropdown menu item had no onClick handler
6. **Add button doesn't reset**: "Add Vendor" button didn't clear editing state

## Solution Implemented

### 1. Added `updateVendor` Function
```typescript
const updateVendor = async () => {
  if (!editingVendor) return;

  try {
    const response = await fetch(`/api/admin/ads/vendors?id=${editingVendor.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newVendor.name,
        type: newVendor.type,
        description: newVendor.description,
        isActive: newVendor.isActive,
        config: {
          apiKey: newVendor.apiKey,
          apiSecret: newVendor.apiSecret,
          siteId: newVendor.siteId,
          publisherId: newVendor.publisherId,
          verificationCode: newVendor.verificationCode,
          verificationFile: newVendor.verificationFile,
          adsTxtEntry: newVendor.adsTxtEntry,
          isVerified: newVendor.isVerified
        }
      }),
    });

    if (response.ok) {
      toast({ title: "Success", description: "Ad vendor updated successfully" });
      setShowCreateVendor(false);
      resetVendorForm();
      setEditingVendor(null);
      loadData();
    }
  } catch (error) {
    toast({ title: "Error", description: "Failed to update vendor", variant: "destructive" });
  }
};
```

**What it does**:
- Checks if `editingVendor` is set
- Sends PUT request to `/api/admin/ads/vendors?id={vendorId}`
- Includes all form fields and verification settings
- Shows success/error toast
- Reloads vendor list on success

### 2. Added `deleteVendor` Function
```typescript
const deleteVendor = async (vendorId: string, vendorName: string) => {
  if (!confirm(`Are you sure you want to delete "${vendorName}"? This action cannot be undone.`)) {
    return;
  }

  try {
    const response = await fetch(`/api/admin/ads/vendors?id=${vendorId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      toast({ title: "Success", description: "Ad vendor deleted successfully" });
      loadData();
    } else {
      const error = await response.json();
      toast({ 
        title: "Error", 
        description: error.error || "Failed to delete vendor", 
        variant: "destructive" 
      });
    }
  } catch (error) {
    toast({ title: "Error", description: "Failed to delete vendor", variant: "destructive" });
  }
};
```

**What it does**:
- Shows confirmation dialog before deleting
- Sends DELETE request to `/api/admin/ads/vendors?id={vendorId}`
- Handles error if vendor has associated campaigns/placements
- Reloads vendor list on success

### 3. Added useEffect to Populate Form on Edit
```typescript
useEffect(() => {
  if (editingVendor) {
    const config = editingVendor.config as any || {};
    setNewVendor({
      name: editingVendor.name,
      type: editingVendor.type,
      description: editingVendor.description || "",
      isActive: editingVendor.isActive,
      apiKey: config.apiKey || "",
      apiSecret: config.apiSecret || "",
      siteId: config.siteId || "",
      publisherId: config.publisherId || "",
      verificationCode: config.verificationCode || "",
      verificationFile: config.verificationFile || "",
      adsTxtEntry: config.adsTxtEntry || "",
      isVerified: config.isVerified || false
    });
  }
}, [editingVendor]);
```

**What it does**:
- Watches `editingVendor` state
- When vendor is selected for editing, populates all form fields
- Extracts config fields (API keys, verification data) from JSON
- Handles missing/null values with empty strings or false

### 4. Updated Submit Button Logic
```typescript
<Button
  onClick={editingVendor ? updateVendor : createVendor}
  disabled={!newVendor.name}
>
  {editingVendor ? "Update Vendor" : "Create Vendor"}
</Button>
```

**What it does**:
- Conditionally calls `updateVendor()` when editing or `createVendor()` when creating
- Button text changes based on mode: "Update Vendor" vs "Create Vendor"
- Same validation (requires name field)

### 5. Wired Delete Button
```typescript
<DropdownMenuItem 
  className="text-red-600"
  onClick={() => deleteVendor(vendor.id, vendor.name)}
>
  <Trash2 className="w-4 h-4 mr-2" />
  Delete
</DropdownMenuItem>
```

**What it does**:
- Calls `deleteVendor()` with vendor ID and name
- Passes name for confirmation dialog
- Red styling to indicate destructive action

### 6. Fixed "Add Vendor" Button
```typescript
<Button
  onClick={() => {
    setEditingVendor(null);
    resetVendorForm();
    setShowCreateVendor(true);
  }}
>
  <Plus className="w-4 h-4 mr-2" />
  Add Vendor
</Button>
```

**What it does**:
- Clears `editingVendor` state (exits edit mode)
- Resets form to empty values
- Opens dialog for creating new vendor

### 7. Added Cleanup on Success
Updated `createVendor()` to also clear editing state:
```typescript
setShowCreateVendor(false);
resetVendorForm();
setEditingVendor(null);  // Added this line
loadData();
```

## Testing Checklist

### Edit Vendor
- [x] Click Edit on existing vendor
- [x] Dialog opens with title "Edit Ad Vendor"
- [x] All fields populate with existing values
- [x] Modify name, description, or settings
- [x] Click "Update Vendor"
- [x] Success toast appears
- [x] Changes reflected in vendor list
- [x] Dialog closes

### Delete Vendor
- [x] Click Delete on vendor
- [x] Confirmation dialog appears with vendor name
- [x] Click OK to confirm
- [x] Success toast appears
- [x] Vendor removed from list
- [x] Click Cancel to abort
- [x] Vendor remains in list

### Delete with Dependencies
- [x] Try to delete vendor with campaigns
- [x] Error toast appears: "Cannot delete vendor with associated campaigns or placements"
- [x] Vendor remains in list

### Deactivate/Activate
- [x] Click Deactivate on active vendor
- [x] Success toast appears
- [x] Badge changes from "Active" to "Inactive"
- [x] Click Activate on inactive vendor
- [x] Badge changes back to "Active"

### Add New Vendor
- [x] Click "Add Vendor" button
- [x] Dialog opens with title "Add New Ad Vendor"
- [x] All fields are empty
- [x] Fill in required fields
- [x] Click "Create Vendor"
- [x] New vendor appears in list

### Edit After Add
- [x] Click "Add Vendor"
- [x] Fill form but don't submit
- [x] Click Cancel
- [x] Edit an existing vendor
- [x] Form shows correct vendor data (not previous add form)

## API Endpoints Used

### PUT /api/admin/ads/vendors?id={vendorId}
- **Auth**: SUPERADMIN only
- **Body**: Vendor fields to update (name, type, description, isActive, config)
- **Response**: `{ success: true, vendor: {...} }`
- **Errors**: 
  - 401 if not SUPERADMIN
  - 400 if ID missing
  - 404 if vendor not found

### DELETE /api/admin/ads/vendors?id={vendorId}
- **Auth**: SUPERADMIN only
- **Response**: `{ success: true, message: "Vendor deleted successfully" }`
- **Errors**:
  - 401 if not SUPERADMIN
  - 400 if ID missing or vendor has dependencies
  - 404 if vendor not found

## Files Modified

1. **app/admin/ads/page.tsx**
   - Added `updateVendor()` function
   - Added `deleteVendor()` function
   - Added useEffect to populate form on edit
   - Updated submit button to conditionally call update/create
   - Wired delete button onClick
   - Fixed "Add Vendor" button to reset state

## Related Documentation

- **API Documentation**: `/app/api/admin/ads/vendors/route.ts`
- **Ad Vendor Guide**: `/AD_VENDOR_VERIFICATION_GUIDE.md`
- **Implementation**: `/AD_VENDOR_VERIFICATION_IMPLEMENTATION.md`

## Benefits

1. **Complete CRUD**: Now all operations work (Create, Read, Update, Delete)
2. **Better UX**: Confirmation dialogs prevent accidental deletions
3. **Form Persistence**: Edit mode properly loads existing data
4. **State Management**: Proper cleanup when switching between add/edit modes
5. **Error Handling**: Clear messages for validation and permission errors
6. **Safe Deletion**: Prevents deleting vendors with active campaigns

## Next Steps

- Consider adding inline editing for quick changes
- Add bulk operations (delete multiple, bulk activate/deactivate)
- Add search/filter to vendor list
- Add vendor usage analytics
- Add export/import functionality for vendor configs

---

**Status**: ✅ Complete and Tested
**Date**: 2025-11-12
**Issue**: Edit, Deactivate, and Delete functions not working for ad vendors
**Resolution**: Added missing CRUD functions and proper state management
