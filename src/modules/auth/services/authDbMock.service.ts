const USER_DB: { id: number; email: string; password: string; } = {
	id: 1,
	email: "test@example.com",
	password: "password123", 
};

export async function getUserFromDb(id: number) {
  return USER_DB.id === id ? USER_DB : null;
}