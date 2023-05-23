<p align="center">
  <a href="https://github.com/advanced-security/generate-sbom-action"><img alt="test status" src="https://github.com/advanced-security/generate-sbom-action/actions/workflows/test.yml/badge.svg"></a>
</p>

# Generate SBOM Action

This action uses the REST API call to generate the SBOM for the repo (on the default branch). You can then use the `fileName` output to upload the file(s) as an artifact. 

## Usage

You can use the workflow as follows to retrieve the SBOM for the current repo:

```yaml
  gen-sbom-for-repo:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: advanced-security/generate-sbom-action@v1
      id: gensbom
    - uses: actions/upload-artifact@v3
      with:
        name: sbom
        path: ${{ steps.gensbom.outputs.fileName }}
```

Or, the action can generate all SBOMs for a given organization (PAT required):

```yaml
  gen-sbom-for-repo:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: advanced-security/generate-sbom-action@v1
      id: gensbom
      with:
        token: ${{ secrets.PAT }}
        resource: ${{ github.repository_owner }}
    - uses: actions/upload-artifact@v3
      with:
        name: sbom-org
        path: ${{ steps.gensbom.outputs.fileName }}
```
