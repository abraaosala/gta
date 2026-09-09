# Deploy do GTA-Tech para a Hostinger via GitHub Actions

Este documento explica como publicar automaticamente o site na **Hostinger** sempre que fizer *push* para a branch `main`. O deploy é feito por **SSH + rsync** e a pasta `dist` é gerada e enviada automaticamente, incluindo o ficheiro `.htaccess` que aponta as rotas para o `index.html`.

---

## Como funciona

1. Qualquer `push` na branch `main` (ou execução manual) dispara o workflow.
2. O GitHub Actions:
   - instala as dependências (`npm ci`);
   - faz o *type-check* (`npm run lint`);
   - gera a pasta `dist` (`npm run build`);
   - **o Vite copia `public/.htaccess` → `dist/.htaccess`** automaticamente;
   - envia o conteúdo de `dist/` para `dist/` do domínio na Hostinger via SSH + rsync.
3. O `.htaccess` no servidor reescreve todas as rotas (`/admin`, `/login`, `/admin/services`, …) para o `index.html`, permitindo o *client-side routing* do TanStack Router.

---

## Ficheiros criados

| Ficheiro | Função |
|----------|--------|
| `public/.htaccess` | Regras Apache: reescrita SPA para `index.html`, cache de assets, compressão e cabeçalhos de segurança. Copiado para `dist/` em cada build. |
| `.github/workflows/deploy-hostinger.yml` | Workflow que constrói e faz o deploy por SSH + rsync. |
| `DEPLOY-HOSTINGER.md` | Este documento. |

> O `public/.htaccess` é a **fonte única** — o Vite copia-o para `dist/` em cada build, por isso não precisa de o gerar manualmente nem de o colocar no servidor à mão.

---

## Configuração única (uma vez)

### 1. Preparar a chave SSH no servidor

1. Gere (ou reutilize) um par de chaves.
2. Adicione a **chave pública** ao ficheiro `~/.ssh/authorized_keys` do utilizador SSH da Hostinger.
3. Anote o **conteúdo da chave privada** — vai ser guardado como secret no GitHub.

### 2. Secrets no GitHub

Em **GitHub → Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Valor |
|--------|-------|
| `SSH_KEY` | Conteúdo completo da chave privada autorizada no servidor (ex: `-----BEGIN OPENSSH PRIVATE KEY-----`). |
| `SSH_HOST` | IP/hostname do servidor — ex: `31.220.106.101` (sem prefixo de protocolo). |
| `SSH_PORT` | Porta SSH. Exemplo de hospedagem Hostinger: **65002**. |
| `SSH_USERNAME` | Utilizador SSH — ex: `u634834160`. |

### 3. Variável no GitHub

Na mesma página, em **Variables**, crie:

| Variable | Valor |
|----------|-------|
| `SSH_TARGET_DIR` | Caminho **absoluto** de destino no servidor — ex: `/home/u634834160/domains/gtatech.ao/public_html/dist/`. |

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

## Testar a conexão SSH localmente

Para confirmar que a chave e o destino estão corretos **antes** de depender do GitHub Actions:

```bash
# Conectar e ver a estrutura do domínio
ssh -p 65002 u634834160@31.220.106.101 "ls -la domains/gtatech.ao/public_html/dist"

# Enviar os ficheiros gerados
rsync -avz --delete -e "ssh -p 65002" ./dist/ \
  u634834160@31.220.106.101:/home/u634834160/domains/gtatech.ao/public_html/dist/
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

---

## Notas e resolução de problemas

- **`ssh: connect to host port 65002: Connection timed out`** — a porta SSH pode estar bloqueada para os IPs do GitHub (Azure) no firewall. Confirmar com o suporte da Hostinger se o acesso SSH externo está permitido.
- **`Permission denied (publickey)`** — a chave privada no secret `SSH_KEY` não corresponde a nenhuma chave pública no `authorized_keys` do servidor. Verifique também que não precisa de passphrase (se tiver, gere uma chave sem passphrase para CI ou configure `SSH_KEY_PASS`).
- **`Host key verification failed`** — foram adicionados os `known_hosts` automaticamente no workflow; se o servidor mudar de chave, apague a entrada antiga.
- **O `.htaccess` não aparece na `dist`?** — Certifique-se de que está em `public/.htaccess`. O Vite copia tudo de `public/` para `dist/` no build.
- **`rsync: command not found` no runner?** — o `ubuntu-latest` já traz `rsync` instalado.
- **Deploy parece "antigo"?** — o rsync usa `--delete`, que remove ficheiros órfãos do destino. Verifique o cache do browser (Ctrl+Shift+R).
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
Deploy via SSH + rsync → dist/ do domínio
   │
   ▼
.htaccess reescreve rotas → index.html
```