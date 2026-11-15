import { RolesSeeder } from '../../core/roles/roles.seeder';
import { UsersSeeder } from '../../core/users/users.seeder';
import { ProgressSeeder } from '../../core/progress/progress.seeder';
import { ContentSeeder } from './content.seeder';

export const allSeeder = [
    RolesSeeder,
    UsersSeeder,
    ProgressSeeder,
    ContentSeeder,
];
