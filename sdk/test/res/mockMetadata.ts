const jsonContent = `{
  "name": "Example Hypercert",
  "description": "This is where the description of the hypercert will go.",
  "external_url": "https://hypercerts.xyz",
  "image": "ipfs://bafybeifs7abhcooeelyjxmnlrcd5kuupfl5czhtyub2imzxzccrhzz3bem",
  "version": "1.0.0",
  "properties": [
    {
      "trait_type": "Example Property 1",
      "value": "Some text here"
    },
    {
      "trait_type": "Example Property 2",
      "value": "More text here"
    }
  ],
  "hypercert": {
    "impact_scope": {
      "name": "Impact Scope",
      "value": [
        "all"
      ],
      "display_value": "All"
    },
    "work_scope": {
      "name": "Work Scope",
      "value": [
        "art design",
        "metadata standards"
      ],
      "display_value": "Art Design & Metadata Standards"
    },
    "work_timeframe": {
      "name": "Work Timeframe",
      "value": [
        1663819200,
        1673163072
      ],
      "display_value": "2022-09-22 \u2192 2023-01-08"
    },
    "impact_timeframe": {
      "name": "Impact Timeframe",
      "value": [
        1673163072,
        0
      ],
      "display_value": "2023-01-08 \u2192 Indefinite"
    },
    "contributors": {
      "name": "Contributors",
      "value": [
        "0x799B774204A348E1182fE01074C51444bA70A149"
      ],
      "display_value": "0x799...149"
    },
    "rights": {
      "name": "Rights",
      "value": [
        "public display",
        "-transfers"
      ],
      "display_value": "Public display"
    }
  }
}`;

export default JSON.parse(jsonContent);
