export interface User{
    id: string;
    name:string;
    email: string;
    role:'user' |'admin'
}

export interface AuthResponse{
    user:User;
    token:string;
    refreshToken: string;
   
}

export interface LoginPayload{
    email:string;
    password:string;
}

export interface RegisterPayload{
    
    name:string;
      email:string;
    password:string;
}