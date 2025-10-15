export type THistory = {
    application_id: string;
    submitted_date: string;
    intended_date: string;
    last_name: string;
    first_name: string;
    gender: string;
    checking_by: string;
    passport_number: string;
    country_of_passport: string;
    first_status: string;
}

export type TotalPaginate = {
    count: bigint | any
}

export type Reject = {
    process_id: number
    reason_rejected: string | null
    rejected_by: number
}

export type TotalPagination = {
    count: number | any
}

export interface ResArticle {
    article_id: number;
    created_date: string;
    language_name: string;
    article_title: string;
    article_short_detail: string;
    article_detail: string;
    article_thumbnail: string | null;
    language_id: number | null;
}
