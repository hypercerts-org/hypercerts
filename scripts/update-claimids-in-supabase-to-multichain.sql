update "allowlistCache-chainId" set "claimId" = concat("chainId", '-', "claimId");
update "allowlistCache-optimism" set "claimId" = concat('10', '-', "claimId");
update "allowlistCache-goerli" set "claimId" = concat('5', '-', "claimId");
update "allowlistCache-sepolia" set "claimId" = concat('11155111', '-', "claimId");

update "claims-metadata-mapping" set "claimId" = concat("chainId", '-', "claimId");

update "collections" set "claimId" = concat("chainId", '-', "claimId");

update "zuzalu-community-hypercerts" set "claimId" = concat("chainId", '-', "claimId");