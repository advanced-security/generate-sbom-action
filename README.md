<p align="center">
  <a href="https://github.com/advanced-security/generate-sbom-action"><img alt="test status" src="https://github.com/advanced-security/generate-sbom-action/actions/workflows/test.yml/badge.svg"></a>
</p>

# Generate SBOM Action

This action uses the REST API call to generate the SBOM for the repo (on the default branch). You can then use the `fileName` output to upload the file as an artifact. 

## Usage

You can use the workflow as follows:

```yaml
gen-sbom:
  runs-on: ubuntu-latest
  steps:
  - uses: actions/checkout@v4
  - uses: advanced-security/generate-sbom-action@v1
    id: gensbom
  - uses: actions/upload-artifact@v4
    with:
      name: sbom
      path: ${{ steps.gensbom.outputs.fileName }}
```
