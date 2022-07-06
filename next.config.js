function envy(key, defaultValue) {
  if (process && process.env && process.env[key]) {
      return process.env[key];
  }

  return defaultValue;
}

const base = {
  FILE_DOMAIN_URL: envy("FILE_DOMAIN_URL", "https://carb-overlayteam.sitecoresandbox.cloud/api/public/content"),
  EDIT_PAGE_URL: envy("EDIT_PAGE_URL", "https://carb-overlayteam.sitecoresandbox.cloud/resolveeditor/"),
  GRAPHQL_ENDPOINT_PREVIEW: envy("GRAPHQL_ENDPOINT", "https://carb-overlayteam.sitecoresandbox.cloud/api/graphql/preview/v1/"),
  GRAPHQL_SECRET_PREVIEW: envy("GRAPHQL_SECRET", "QVova0ZJRHY0a1FVRG1WTWNQZlhxZVNldWdBTitDcEFpNC8yeHkrNW9STT18Y2FyYi1vdmVybGF5dGVhbQ=="),
  GRAPHQL_ENDPOINT: envy("GRAPHQL_ENDPOINT", "https://edge-beta.sitecorecloud.io/api/graphql/v1/"),
  GRAPHQL_SECRET: envy("GRAPHQL_SECRET", "Mkk1czVsUzhSa0JSdDBiVDVKaDdwb0ovVUlXa0ViWFV0Z3d0QVN2TFR3bz18Y2FyYi1vdmVybGF5dGVhbQ=="),
  // Logo must be in public/images
  LOGO_FILE: envy("LOGO_FILE", "CozyBedLogo-white.svg"),
  PAGE_TITLE: envy("PAGE_TITLE", "Cozy Bed Hotels"),
  CDP_PROXY_HOST: envy("CDP_PROXY_HOST", "http://localhost:3000"),
  CDP_API_TARGET_ENDPOINT: envy("CDP_API_TARGET_ENDPOINT", "https://api.boxever.com/v1.2"),
  CDP_CLIENT_KEY: envy("CDP_CLIENT_KEY", "demus02u1pkrra9te2thparua6r964fs"),
  CDP_API_TOKEN: envy("CDP_API_TOKEN", ""),
};

const envDelivery = {
  ...base,
};

const envPreview = {
  ...base,
};


/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
      // you can swap this between envPreview and envDelivery to test both endpoints simply for PoC
      env: envDelivery,
}
