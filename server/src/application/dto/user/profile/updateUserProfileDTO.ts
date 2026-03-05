

export interface updateUserProfileRequest  {
    name?: string;
    email?: string;
    phone?: string;
    profileImage?: Express.Multer.File;
}