# Deploy do GTA-Tech para o Hostinger via GitHub Actions

Este documento explica como publicar automaticamente o site na **Hostinger** sempre que fizer *push* para a branch `main`. O deploy é feito por **FTP/FTPS** e a pasta `dist` é gerada e enviada automaticamente, incluindo o ficheiro `.htaccess` que aponta as rotas para o `index.html`.

> **Porquê FTP e não SSH?** Em hospedagem partilhada, o firewall da Hostinger bloqueia os IPs dos runners do GitHub (Azure) para acesso SSH — daí o `Connection timed out`. O FTP/FTPS (porta 21) **não é bloqueado**, por isso usa-se este método.

---

## Como funciona

1. Qualquer `push` na branch `main` (ou execução manual) dispara o workflow.
2. O GitHub Actions:
   - instala as dependências (`npm ci`);
   - faz o *type-check* (`npm run lint`);
   - gera a pasta `dist` (`npm run build`);
   - **o Vite copia `public/.htaccess` → `dist/.htaccess`** automaticamente;
   - envia o conteúdo de `dist/` para `public_html/` da Hostinger via FTPS.
3. O `.htaccess` no servidor reescreve todas as rotas (`/admin`, `/login`, `/admin/services`, …) para o `index.html`, permitindo o *client-side routing* do TanStack Router.

---

## Ficheiros criados

| Ficheiro | Função |
|----------|--------|
| `public/.htaccess` | Regras Apache: reescrita SPA para `index.html`, cache de assets, compressão e cabeçalhos de segurança. Copiado para `dist/` em cada build. |
| `.github/workflows/deploy-hostinger.yml` | Workflow que constrói e faz o deploy por FTP. |
| `DEPLOY-HOSTINGER.md` | Este documento. |

> O `public/.htaccess` é a **fonte única** — o Vite copia-o para `dist/` em cada build, por isso não precisa de o gerar manualmente nem de o colocar no servidor à mão.

---

## Configuração única (uma vez)

### 1. Criar uma conta FTP

1. No hPanel da Hostinger: **Files → FTP Accounts**.
2. Crie (ou utilize) uma conta FTP e anote o **utilizador** e a **palavra-passe**.

### 2. Secrets no GitHub

Em **GitHub → Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Valor |
|--------|-------|
| `FTP_HOST` | Servidor FTP. **Importante: apenas o endereço, SEM prefixo** — ex: `31.220.106.101` (e **não** `ftp://31.220.106.101`). |
| `FTP_USER` | Utilizador FTP (da conta criada acima). |
| `FTP_PASS` | Palavra-passe FTP. |

> O `FTP_HOST` deve conter **só o IP/hostname**. Se colocar o prefixo `ftp://`, a resolução de DNS falha com `getaddrinfo ENOTFOUND`.

---

## Como testar manualmente

Pode executar o workflow sem fazer push:

1. GitHub → **Actions** → **Deploy Hostinger** → **Run workflow**.

Ou, no terminal:

```bash
# Disparar manualmente
gh workflow run deploy-hostinger.yml

# Ver o estado
gh run watch
```

---

## Verificar a implementação local

Para confirmar que tudo gera como esperado **antes** de depender do GitHub Actions:

```bash
npm ci
npm run lint        # type-check
npm run build       # gera dist/
ls -la dist/.htaccess   # deve existir
```

Se quiser ver o `.htaccess` final na `dist`:

```bash
cat dist/.htaccess
```

---

## Notas e resolução de problemas

- **O `.htaccess` não aparece na `dist`?** — Certifique-se de que está em `public/.htaccess`. O Vite copia tudo de `public/` para `dist/` no build.
- **`getaddrinfo ENOTFOUND` no passo FTP?** — O valor do secret `FTP_HOST` não resolve. Confirme que está **apenas** o endereço (ex: `31.220.106.101`), **sem** `ftp://` nem espaços.
- **`Failed to connect... server only supports SFTP`?** — O plano atual usa `protocol: ftps`, porta 21. Se a Hostinger exigir FTPS explicito ou SFTP, ajuste `protocol` e `port` na ação.
- **Deploy parece "antigo"?** — Se `dangerous-clean-slate: false`, ficheiros órfãos ficam; verifique o cache do browser (Ctrl+Shift+R) e, em caso de problema, ative `dangerous-clean-slate: true`.
- **Quer ativar em branches diferentes?** — Altere `branches: [main]` no workflow.
- **Se o site estiver numa subpasta** (ex: `https://dominio/gta/`) — é preciso ajustar o `RewriteBase` no `public/.htaccess` e possivelmente a `base` do Vite; o cenário suportado por estes ficheiros é pasta raiz do domínio.

---

## Resumo do fluxo

```
push → main
   │
   ▼
npm ci → lint → build (gera dist/ + dist/.htaccess)
   │
   ▼
Deploy via FTPS → public_html/
   │
   ▼
.htaccess reescreve rotas → index.html
```
