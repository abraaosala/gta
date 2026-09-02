# Deploy do GTA-Tech para o Hostinger via GitHub Actions

Este documento explica como publicar automaticamente o site na **Hostinger** sempre que fizer *push* para a branch `main`. O deploy é feito por **SSH (chave global)** e a pasta `dist` é gerada e enviada automaticamente, incluindo o ficheiro `.htaccess` que aponta as rotas para o `index.html`.

---

## Como funciona

1. Qualquer `push` na branch `main` (ou execução manual) dispara o workflow.
2. O GitHub Actions:
   - instala as dependências (`npm ci`);
   - faz o *type-check* (`npm run lint`);
   - gera a pasta `dist` (`npm run build`);
   - **o Vite copia `public/.htaccess` → `dist/.htaccess`** automaticamente;
   - envia o conteúdo de `dist` para a Hostinger via SSH/SCP;
   - apaga o conteúdo antigo e extrai o novo, garantindo deploy limpo.
3. O `.htaccess` no servidor reescreve todas as rotas (`/admin`, `/login`, `/admin/services`, …) para o `index.html`, permitindo o *client-side routing* do TanStack Router.

---

## Ficheiros criados

| Ficheiro | Função |
|----------|--------|
| `public/.htaccess` | Regras Apache: reescrita SPA para `index.html`, cache de assets, compressão e cabeçalhos de segurança. Copiado para `dist/` em cada build. |
| `.github/workflows/deploy-hostinger.yml` | Workflow que constrói e faz o deploy por SSH. |
| `DEPLOY-HOSTINGER.md` | Este documento. |

> O `public/.htaccess` é a **fonte única** — o Vite copia-o para `dist/` em cada build, por isso não precisa de o gerar manualmente nem de o colocar no servidor à mão.

---

## Configuração única (uma vez)

### 1. Secrets no GitHub

Em **GitHub → Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Valor |
|--------|-------|
| `SSH_PRIVATE_KEY` | A chave **privada** SSH global da Hostinger (conteúdo de `id_rsa`/`id_ed25519`). **Nunca** a pública — apenas a privada. |
| `SSH_HOST` | IP do servidor. **Default no workflow: `31.220.106.101`** (defina o secret apenas se mudar). |
| `SSH_USER` | Utilizador SSH. **Default no workflow: `u634834160`**. |
| `SSH_PORT` | Porta SSH. **Default no workflow: `65002`**. |
| `TARGET_PATH_GTA` | **Obrigatório.** Caminho absoluto da pasta pública, sem barra final. Para o domínio `gtatech.ao`, é normalmente: `/home/u634834160/domains/gtatech.ao/public_html`. O sufixo `_GTA` distingue este secret de outros projetos que partilhem o mesmo servidor. |
| `FTP_HOST` | Servidor FTP da Hostinger (ex: `ftp.gtatech.ao`). Usado **apenas como fallback** quando o SSH dos runners dá timeout. |
| `FTP_USER` | Utilizador FTP (criado em **hPanel → Files → FTP Accounts**). |
| `FTP_PASS` | Palavra-passe FTP. |

> O workflow já assume os valores reais do teu terminal (`31.220.106.101:65002` como `u634834160`), por isso `SSH_HOST`, `SSH_USER` e `SSH_PORT` ficam opcionais. Necessários: `SSH_PRIVATE_KEY`, `TARGET_PATH_GTA` (e `FTP_HOST`/`FTP_USER`/`FTP_PASS` se quiseres o fallback).
>
> **Porquê o fallback FTP?** Em hospedagem partilhada, o firewall da Hostinger bloqueia, por vezes, os IPs dos runners do GitHub (Azure) para acesso SSH — daí o `Connection timed out`. O FTP/FTPS normalmente **não é bloqueado**. Se o passo "Deploy via SSH" falhar, o workflow envia o `dist/` por FTPS (porta 21) para `public_html/` automaticamente.

### 2. Onde obter a chave SSH

- No painel da Hostinger: **Avançado → SSH Access** (ou `hPanel → SSH`), ative o SSH e gere/use a chave já existente.
- A chave **privada** é o que coloca em `SSH_PRIVATE_KEY`.
- A chave **pública** deve estar registada na Hostinger (Authorized keys).

### 3. Confirmar o caminho público (`TARGET_PATH_GTA`)

O `public_html` (ou `www`) é o diretório base do domínio. O `dist` da aplicação será extraído diretamente nesse diretório. Confirme o caminho com:

```bash
ssh -p 65002 u634834160@31.220.106.101 "pwd && ls -la"
```

Normalmente a pasta é:
```
/home/u634834160/domains/<dominio>/public_html
```

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

## Primeira execução e o `known_hosts`

O workflow executa `ssh-keyscan` para adicionar o host ao `known_hosts` automaticamente. Se por algum motivo a ligação for recusada por *host key*, pode adicionar o output de:

```bash
ssh-keyscan -H <IP_OU_DOMINIO>
```

…e guardá-lo como secret `SSH_HOST_KEY` (o workflow já está preparado para essa eventualidade, mas por defeito usa `ssh-keyscan` em tempo de execução).

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
- **`Connection timed out` no passo "Deploy via SSH"?** — É o firewall dinâmico da Hostinger a bloquear os IPs dos runners (Azure) para SSH em hospedagem partilhada. Não é erro de configuração: repete o run ou deixa o **fallback FTP** tratar (envia `dist/` por FTPS). Confirma que definiste `FTP_HOST`/`FTP_USER`/`FTP_PASS`.
- **Erro de permissão ao extrair no servidor?** — Confirme que o utilizador SSH tem escrita na `TARGET_PATH_GTA` e que o caminho está correto.
- **Deploy parece "antigo"?** — O workflow apaga o conteúdo remoto antes de extrair; se persistir, verifique o cache do browser (Ctrl+Shift+R).
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
Deploy via SSH p/ TARGET_PATH_GTA
   │  (se SSH der timeout → fallback FTPS p/ public_html)
   ▼
.htaccess reescreve rotas → index.html
```
