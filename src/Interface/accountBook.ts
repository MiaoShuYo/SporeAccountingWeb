// 账本信息接口
export interface AccountBook {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  createTime: string;
  updateTime: string;
  isDefault: boolean;
  currency: string;
  balance: number;
}

// 创建账本请求接口
export interface CreateAccountBookRequest {
  name: string;
  description?: string;
  coverImage?: string;
  currency: string;
}

// 更新账本请求接口
export interface UpdateAccountBookRequest {
  id: string;
  name?: string;
  description?: string;
  coverImage?: string;
  currency?: string;
} 