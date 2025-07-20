/// <summary>
/// 报表类型枚举
/// </summary>
export enum ReportTypeEnum {
    /// <summary>
    /// 月度报表
    /// </summary>
    Monthly = 1,
    /// <summary>
    /// 季度报表
    /// </summary>
    Quarterly = 2,
    /// <summary>
    /// 年度报表
    /// </summary>
    Yearly = 3
}

/// <summary>
/// 报表请求参数
/// </summary>
export interface ReportRequest {
    /// <summary>
    /// 报表类型
    /// </summary>
    reportType: ReportTypeEnum;
    /// <summary>
    /// 年份
    /// </summary>
    year: number;
    /// <summary>
    /// 月份
    /// </summary>
    month?: number;
}

/// <summary>
/// 报表数据项
/// </summary>
export interface ReportDataItem {
    /// <summary>
    /// 时间标签（年月或年）
    /// </summary>
    timeLabel: string;
    /// <summary>
    /// 支出金额
    /// </summary>
    expenseAmount: number;
    /// <summary>
    /// 收入金额
    /// </summary>
    incomeAmount: number;
    /// <summary>
    /// 净收入（收入-支出）
    /// </summary>
    netIncome: number;
}

/// <summary>
/// 报表响应数据
/// </summary>
export interface ReportResponse {
    /// <summary>
    /// 报表数据列表
    /// </summary>
    data: ReportDataItem[];
    /// <summary>
    /// 总支出
    /// </summary>
    totalExpense: number;
    /// <summary>
    /// 总收入
    /// </summary>
    totalIncome: number;
    /// <summary>
    /// 总净收入
    /// </summary>
    totalNetIncome: number;
} 