from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    """
    Allows access only to users who have the 'admin' role.
    """
    def has_permission(self, request, view):
        # Must be logged in AND have the 'admin' role in the User model
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'admin'
        )