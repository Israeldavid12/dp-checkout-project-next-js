// lib/facebookCookies.js

// Gera e salva _fbp e _fbc a partir de um fbclid (vindo da URL)
export function setFbCookiesFromFbclid(fbclid) {
  if (!fbclid) return {
    fbp: null,
    fbc: null
  };

  const timestamp = Math.floor(Date.now() / 1000);
  const randomNum = Math.floor(Math.random() * 1e10);

  // formatos oficiais do Meta
  const fbp = `fb.1.${timestamp}.${randomNum}`;
  const fbc = `fb.1.${timestamp}.${fbclid}`;

  const expires = new Date();
  expires.setDate(expires.getDate() + 90); // 90 dias

  document.cookie = `_fbp=${fbp}; path=/; expires=${expires.toUTCString()}`;
  document.cookie = `_fbc=${fbc}; path=/; expires=${expires.toUTCString()}`;

  console.log("✅ Cookies criados:", { fbp, fbc });
  return { fbp, fbc };
}

// Lê cookies existentes no navegador
export function getFbCookies() {
  const cookies = document.cookie.split(";").reduce((acc, c) => {
    const [k, v] = c.trim().split("=");
    acc[k] = v;
    return acc;
  }, {});
  return {
    fbp: cookies["_fbp"],
    fbc: cookies["_fbc"],
  };
}
