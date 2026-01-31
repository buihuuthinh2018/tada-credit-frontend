import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API Response type
type ApiResponse<T> = AxiosResponse<T>;

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    // Khởi tạo axios instance
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    // Request interceptor - tự động thêm token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - xử lý lỗi chung
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Có thể thêm logic refresh token ở đây
        if (error.response?.status === 401) {
          // Token hết hạn
        //   this.clearAuthToken();
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  // GET request
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.axiosInstance.get<T>(endpoint, config);
  }

  // POST request
  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.axiosInstance.post<T>(endpoint, data, config);
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.axiosInstance.patch<T>(endpoint, data, config);
  }

  // DELETE request
  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.axiosInstance.delete<T>(endpoint, config);
  }

  // PUT request (thêm nếu cần)
  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.axiosInstance.put<T>(endpoint, data, config);
  }

  // Set auth token
  setAuthToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  // Clear auth token
  clearAuthToken() {
      if (typeof window !== 'undefined') {
        console.log("Clearing auth tokens");
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // Get axios instance (nếu cần custom request)
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
);

export default apiClient;
