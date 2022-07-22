export async function getUserId(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  const user = await response.json();
  return user.id;
}