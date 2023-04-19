import Result, { err, ok } from "true-myth/result";

import { ClaimByIdQuery, ClaimsByOwnerQuery, RecentClaimsQuery, getBuiltGraphSDK } from "../../.graphclient/index.js";
import { getConfig } from "../config.js";
import { FetchError, HypercertsSdkError } from "../errors.js";

const config = getConfig({});
const sdkConfig = { chainName: config.graphName };

const sdk = getBuiltGraphSDK(sdkConfig);

export const claimsByOwner = async (owner: string): Promise<Result<ClaimsByOwnerQuery, HypercertsSdkError>> =>
  sdk
    .ClaimsByOwner({
      owner,
    })
    .then(
      (result) => ok(result),
      () => err(new FetchError("Error fetching claims by owner", { owner, graphName: config.graphName })),
    );

export const claimById = async (id: string): Promise<Result<ClaimByIdQuery, HypercertsSdkError>> =>
  sdk
    .ClaimById({
      id,
    })
    .then(
      (result) => ok(result),
      () => err(new FetchError("Error fetching claim by id", { id, graphName: config.graphName })),
    );

export const firstClaims = async (first: number): Promise<Result<RecentClaimsQuery, HypercertsSdkError>> =>
  sdk
    .RecentClaims({
      first,
    })
    .then(
      (result) => ok(result),
      () => err(new FetchError("Error fetching recent claims", { first, graphName: config.graphName })),
    );
