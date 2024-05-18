export const crearRepo = async (name, octokit) => {
  try {
    const response = await octokit.repos.createForAuthenticatedUser({
      name: name,
      private: true,
    });

    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};
