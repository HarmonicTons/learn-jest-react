import * as exportList from "../index";

describe("export", () => {
  it("should have all export", () => {
    // components
    expect(exportList).toHaveProperty("HelloWord");
    expect(exportList).toHaveProperty("FindRepo");
  });
});
