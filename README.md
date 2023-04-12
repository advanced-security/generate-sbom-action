<p align="center">
  <a href="https://github.com/colindembovsky/generate-sbom-action"><img alt="test status" src="https://github.com/colindembovsky/generate-sbom-action/workflows/test/badge.svg"></a>
</p>

# Generate SBOM Action

This action uses the REST API call to generate the SBOM for the repo (on the default branch). You can then use the `filename` output to upload the file as an artifact. 

## Usage

You can use the workflow as follows:

```yaml
gen-sbom:
  runs-on: ubuntu-latest
  steps:
  - uses: actions/checkout@v3
  - uses: colindemobvsky/generate-sbom-action@v1
    name: gensbom
  - uses: actions/upload-artifact@v3
    with:
      name: sbom
      path: ${{ steps.gensbom.outputs.fileName }}
```