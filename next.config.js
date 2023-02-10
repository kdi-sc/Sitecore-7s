function envy(key, defaultValue) {
  if (process && process.env && process.env[key]) {
    return process.env[key]
  }

  return defaultValue
}


/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // you can swap this between envPreview and envDelivery to test both endpoints simply for PoC
  // env: envDelivery
}
