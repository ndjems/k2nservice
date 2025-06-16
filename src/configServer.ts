export const getUrlServer=()=>{
    return  import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    
}