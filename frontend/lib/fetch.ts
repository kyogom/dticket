const { API_BASE_URL } = process.env;

export const postAuthCode = async ({
  code,
}: {
  code: string;
}): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/authorize`, {
    method: "POST",
    body: JSON.stringify({ code }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    console.error(await response.json());
    // FIXME: Errorを投げてもvercelのコンソールに出ない
    throw new Error((await response.json()).message);
  }
  const { data } = await response.json();
  return data;
};
