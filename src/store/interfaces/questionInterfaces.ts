export interface Question {
    id: number;
    title: string;
    answerCount: number;
    lastFollowed: string;
    followCount: number;
}

export interface QuestionFormData {
    title: string;
}