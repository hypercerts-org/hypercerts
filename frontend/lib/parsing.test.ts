import { parseAllowlistCsv } from "./parsing";

describe("allowlist", () => {
  it("parses simple allowlist", () => {
    const resultDeduped = parseAllowlistCsv(
      `index,address,price,fractions
0,0x20326E144532f17f76AcA759e61E19aF20A58ef3,0.0,100
1,0x15c7281842A45465B4cbb8F89111d99e36e5bab8,0.0,50
2,0x1cca19b823afa773b09708d94d2ee6ff96c60057,0.0,40
`,
      true,
    );
    expect(resultDeduped).toEqual([
      { address: "0x20326e144532f17f76aca759e61e19af20a58ef3", units: 100 },
      { address: "0x15c7281842a45465b4cbb8f89111d99e36e5bab8", units: 50 },
      { address: "0x1cca19b823afa773b09708d94d2ee6ff96c60057", units: 40 },
    ]);

    const resultNotDeduped = parseAllowlistCsv(
      `index,address,price,fractions
0,0x20326E144532f17f76AcA759e61E19aF20A58ef3,0.0,100
1,0x15c7281842A45465B4cbb8F89111d99e36e5bab8,0.0,50
2,0x1cca19b823afa773b09708d94d2ee6ff96c60057,0.0,40
`,
      false,
    );
    expect(resultNotDeduped).toEqual([
      { address: "0x20326e144532f17f76aca759e61e19af20a58ef3", units: 100 },
      { address: "0x15c7281842a45465b4cbb8f89111d99e36e5bab8", units: 50 },
      { address: "0x1cca19b823afa773b09708d94d2ee6ff96c60057", units: 40 },
    ]);
  });

  it("parses with duplication", () => {
    const result = parseAllowlistCsv(
      `index,address,price,fractions
0,0x20326E144532f17f76AcA759e61E19aF20A58ef3,0.0,100
1,0x15c7281842A45465B4cbb8F89111d99e36e5bab8,0.0,50
2,0x1cca19b823afa773b09708d94d2ee6ff96c60057,0.0,40
3,0x20326E144532f17f76AcA759e61E19aF20A58ef3,0.0,100
4,0x1cca19b823afa773b09708d94d2ee6ff96c60057,0.0,40
`,
      true,
    );
    expect(result).toEqual([
      { address: "0x20326e144532f17f76aca759e61e19af20a58ef3", units: 200 },
      { address: "0x15c7281842a45465b4cbb8f89111d99e36e5bab8", units: 50 },
      { address: "0x1cca19b823afa773b09708d94d2ee6ff96c60057", units: 80 },
    ]);
  });

  it("parses without deduplication", () => {
    const result = parseAllowlistCsv(
      `index,address,price,fractions
0,0x20326E144532f17f76AcA759e61E19aF20A58ef3,0.0,100
1,0x15c7281842A45465B4cbb8F89111d99e36e5bab8,0.0,50
2,0x1cca19b823afa773b09708d94d2ee6ff96c60057,0.0,40
3,0x20326E144532f17f76AcA759e61E19aF20A58ef3,0.0,100
4,0x1cca19b823afa773b09708d94d2ee6ff96c60057,0.0,40
`,
      false,
    );
    expect(result).toEqual([
      { address: "0x20326e144532f17f76aca759e61e19af20a58ef3", units: 100 },
      { address: "0x15c7281842a45465b4cbb8f89111d99e36e5bab8", units: 50 },
      { address: "0x1cca19b823afa773b09708d94d2ee6ff96c60057", units: 40 },
      { address: "0x20326e144532f17f76aca759e61e19af20a58ef3", units: 100 },
      { address: "0x1cca19b823afa773b09708d94d2ee6ff96c60057", units: 40 },
    ]);
  });

  it("parses with new added address", () => {
    const result = parseAllowlistCsv(
      `index,address,price,fractions
0,0x20326E144532f17f76AcA759e61E19aF20A58ef3,0.0,100
1,0x15c7281842A45465B4cbb8F89111d99e36e5bab8,0.0,50
2,0x1cca19b823afa773b09708d94d2ee6ff96c60057,0.0,40
`,
      true,
      [
        {
          address: "0x22E4b9b003Cc7B7149CF2135dfCe2BaddC7a534f",
          percentage: 0.75,
        },
      ],
    );
    expect(result).toEqual([
      { address: "0x20326e144532f17f76aca759e61e19af20a58ef3", units: 100 },
      { address: "0x15c7281842a45465b4cbb8f89111d99e36e5bab8", units: 50 },
      { address: "0x1cca19b823afa773b09708d94d2ee6ff96c60057", units: 40 },
      { address: "0x22e4b9b003cc7b7149cf2135dfce2baddc7a534f", units: 570 },
    ]);
  });

  it("parses with adding existing address", () => {
    const result = parseAllowlistCsv(
      `index,address,price,fractions
0,0x20326E144532f17f76AcA759e61E19aF20A58ef3,0.0,100
1,0x15c7281842A45465B4cbb8F89111d99e36e5bab8,0.0,50
2,0x1cca19b823afa773b09708d94d2ee6ff96c60057,0.0,40
`,
      true,
      [
        {
          address: "0x22e4b9b003cc7b7149cf2135dfce2baddc7a534f",
          percentage: 0.5,
        },
        {
          address: "0x20326e144532f17f76aca759e61e19af20a58ef3",
          percentage: 0.25,
        },
      ],
    );
    expect(result).toEqual([
      { address: "0x20326e144532f17f76aca759e61e19af20a58ef3", units: 290 },
      { address: "0x15c7281842a45465b4cbb8f89111d99e36e5bab8", units: 50 },
      { address: "0x1cca19b823afa773b09708d94d2ee6ff96c60057", units: 40 },
      { address: "0x22e4b9b003cc7b7149cf2135dfce2baddc7a534f", units: 380 },
    ]);
  });

  it("throws if total percentage out of bounds", () => {
    expect(() =>
      parseAllowlistCsv(
        `index,address,price,fractions
0,0x20326E144532f17f76AcA759e61E19aF20A58ef3,0.0,100
1,0x15c7281842A45465B4cbb8F89111d99e36e5bab8,0.0,50
2,0x1cca19b823afa773b09708d94d2ee6ff96c60057,0.0,40
`,
        true,
        [
          {
            address: "0x22e4b9b003cc7b7149cf2135dfce2baddc7a534f",
            percentage: 0.5,
          },
          {
            address: "0x20326e144532f17f76aca759e61e19af20a58ef3",
            percentage: 0.5,
          },
        ],
      ),
    ).toThrow();
  });

  it("throws if individual percentage out of bounds", () => {
    expect(() =>
      parseAllowlistCsv(
        `index,address,price,fractions
0,0x20326E144532f17f76AcA759e61E19aF20A58ef3,0.0,100
1,0x15c7281842A45465B4cbb8F89111d99e36e5bab8,0.0,50
2,0x1cca19b823afa773b09708d94d2ee6ff96c60057,0.0,40
`,
        true,
        [
          {
            address: "0x20326e144532f17f76aca759e61e19af20a58ef3",
            percentage: 1.5,
          },
          {
            address: "0x15c7281842A45465B4cbb8F89111d99e36e5bab8",
            percentage: -0.75,
          },
        ],
      ),
    ).toThrow();
  });

  it("throws if allowlist is empty", () => {
    expect(() =>
      parseAllowlistCsv(
        `index,address,price,fractions
0,0x20326E144532f17f76AcA759e61E19aF20A58ef3,0.0,0`,
        true,
      ),
    ).toThrow();
  });
});
