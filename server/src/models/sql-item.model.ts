type SqlItemTemplate = {
	name: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
};

export interface SqlItemModel extends SqlItemTemplate {
	id: number;
}