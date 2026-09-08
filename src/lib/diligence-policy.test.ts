import assert from "node:assert/strict";
import test from "node:test";
import { evidenceGate } from "./diligence-policy.ts";

test("evidence gate blocks a deal when critical tax, zoning, or hazard evidence is missing", () => {
  const result = evidenceGate([
    { id: "sales", label: "Sales", value: "Verified", status: "verified", sourceIds: ["sales"], confidence: 0.8, detail: "ok" },
    { id: "tax", label: "Tax", value: "Missing", status: "missing", sourceIds: ["tax"], confidence: null, detail: "missing" },
  ]);
  assert.equal(result.blocked, true);
  assert.equal(result.blockers.length, 1);
});

test("evidence gate permits human review when every critical item is verified", () => {
  const result = evidenceGate(["sales", "rent", "tax", "zoning", "hazard"].map((id) => ({
    id,
    label: id,
    value: "Verified",
    status: "verified" as const,
    sourceIds: [id],
    confidence: 0.9,
    detail: "ok",
  })));
  assert.equal(result.blocked, false);
  assert.equal(result.recommendation, "Ready for human underwriting review");
});
