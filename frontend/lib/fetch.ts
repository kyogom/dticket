const { API_BASE_URL } = process.env;

export const postAuthCode = async ({
  code,
  guild_id,
}: {
  code: string;
  guild_id: string;
}): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/authorize`, {
      method: "POST",
      body: JSON.stringify({ code, guild_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
