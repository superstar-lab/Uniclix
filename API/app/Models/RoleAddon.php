<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleAddon extends Model
{
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, "role_addon_permissions", "addon_id", "permission_id");
    }
}
