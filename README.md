# Claude Cloud Workstation

A reproducible cloud Linux workstation designed to run inside temporary cloud compute environments such as Kaggle.

## Architecture

### GitHub

GitHub is the persistent source of truth.

It stores:

- installation scripts
- restoration scripts
- configuration
- Claude Code skills
- MCP configuration
- project knowledge
- design-system knowledge
- client/project information

### Kaggle

Kaggle provides disposable compute.

The Linux environment may disappear when the session ends, so the workstation must always be reproducible from this repository.

### Object storage

Large assets such as:

- MP4
- WebM
- PNG
- JPG
- WebP
- GLB
- WAV

should eventually be stored in cloud object storage rather than Git.

## Planned workstation

The planned workstation will eventually include:

- KDE Plasma X11
- xrdp
- Chromium
- Claude Code
- MCP servers
- Claude Code skills
- project memory/knowledge
- Cloudflare remote access
- RustDesk fallback
- cloud object storage integration

## Remote access architecture

Three remote-access options are planned:

1. xrdp
2. Cloudflare
3. RustDesk

They are separate from the desktop environment.

The initial desktop target is KDE Plasma X11 because xrdp is primarily designed around X11 sessions.

## Persistence model

The important principle is:

**GitHub stores the blueprint.**

**Kaggle provides the temporary machine.**

**Object storage stores large assets.**

A fresh environment should eventually be reconstructable with:

```bash
git clone <repository>
cd <repository>
bash setup.sh
```

## Security

Never commit:

- API keys
- passwords
- access tokens
- SSH private keys
- browser credentials
- Cloudflare tokens
- cloud-storage secrets

Secrets must be supplied through secure environment variables, Kaggle secrets, or another appropriate secret-management mechanism.

## Development strategy

The workstation is intentionally built in stages.

Each major subsystem should be tested independently before the next subsystem is added.

Current stage:

Foundation only.
