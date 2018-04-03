import {Role} from './role.class';
import {Access} from '../user.access';
import {UserType} from '../user.types';

const user = new Role( UserType.User );
user.can(Access.View_Survey);
user.can(Access.Edit_Survey);

const manager = new Role( UserType.Manager );
manager.can(Access.View_Company);
manager.can(Access.Edit_Company);
manager.can(Access.View_Company_Users);
manager.can(Access.Edit_Company_Users);
manager.is(user);

const admin = new Role( UserType.Admin );
admin.can(Access.View_Management_Users);
admin.can(Access.Edit_Management_Users);
admin.can(Access.View_Questions);
admin.can(Access.Edit_Questions);
admin.is(manager);

export const Roles = {};
Roles[ UserType.User ] = user;
Roles[ UserType.Manager ] = manager;
Roles[ UserType.Admin ] = admin;