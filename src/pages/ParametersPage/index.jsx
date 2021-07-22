import React from "react";
import { useSelector } from "react-redux";

import { useParams } from "../../hooks/useParams";
import Loading from "../../components/Loading";

import "./index.css";

const Parameter = ({ _key, value, info }) => (
	<>
		<div className="is-flex is-align-items-baseline mb-1">
			<h2 className="title is-5 mb-0" style={{ whiteSpace: "nowrap" }}>
				{_key}:
			</h2>
			<p className="ml-2 subtitle is-5">{value}</p>
		</div>
		<p className="subtitle is-7 is-flex is-align-items-center mb-4">
			{/* <span className="material-icons-outlined md-14 mr-1">info</span> */}
			{info}
		</p>
		<hr className="mt-0 mb-4" />
	</>
);

const ParametersPage = () => {
	const [loading, params] = useParams();
	const network = useSelector(state => state.network.network);

	if (loading)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	return (
		<main className="section">
			<div className="is-flex-tablet is-align-items-flex-end mb-4">
				<div>
					<h1 className="title is-size-4 is-size-2-tablet">Parameters</h1>
					<p className="subtitle is-size-6 is-size-5-tablet mb-2">
						The consensus rules that dictates the bobcoin protocol.
					</p>
				</div>
				<div className="ml-auto mb-2">
					<p className="subtitle is-size-6 is-size-5-tablet is-flex is-align-items-center mb-1">
						<span className="material-icons-two-tone mr-1">language</span>Current Network: {network}
					</p>
					<p className="subtitle is-7 is-flex is-align-items-center">
						<span className="material-icons-outlined md-14 mr-1">info</span>
						You can change your network at settings.
					</p>
				</div>
			</div>
			<section className="card">
				<div className="card-content params-list">
					<Parameter
						_key="name"
						value={params.name}
						info="Name of the blockchain, network protocol and cryptocurrency."
					/>
					<Parameter _key="symbol" value={params.symbol} info="Ticker symbol of the currency." />
					<Parameter
						_key="coin"
						value={params.coin.toLocaleString()}
						info="How many of the smallest denominations equal to a bobcoin, equivalent to satoshis in bitcoin."
					/>
					<Parameter
						_key="version"
						value={params.version}
						info="Current protocol version number."
					/>
					<Parameter
						_key="checksumLen"
						value={params.checksumLen}
						info="Length of the checksum generated and appended to the public key hash."
					/>
					<Parameter
						_key="addressPre"
						value={params.addressPre}
						info="Prefix added to the pkHashCheck (public key hash + checksum) in the process of generating an address."
					/>
					<Parameter
						_key="initBlkReward"
						value={params.initBlkReward.toLocaleString()}
						info="Initial block reward for mining, expressed in the smallest denomination."
					/>
					<Parameter
						_key="blkRewardHalflife"
						value={params.blkRewardHalflife.toLocaleString()}
						info={`Number of blocks mined before the block reward is halved. The block reward after the first halving event will be initBlkReward / 2 = ${(25600000000).toLocaleString()}`}
					/>
					<Parameter
						_key="initBlkDiff"
						value={params.initBlkDiff.toLocaleString()}
						info="The starting block mining difficulty, and the lower bound difficulty for adjustments in the future."
					/>
					<Parameter
						_key="initHashTarg"
						value={params.initHashTarg}
						info="The hash target in the first difficulty adjustment period, corresponding to the initBlkDiff. Blocks have to be mined with a hash lower or equal to the hash target."
					/>

					<Parameter
						_key="diffRecalcHeight"
						value={params.diffRecalcHeight}
						info="Number of blocks since the last adjustment before the mining difficulty is adjusted again."
					/>
					<Parameter
						_key="targBlkTime"
						value={params.targBlkTime}
						info="Desired time between each block mined expressed in seconds (8 minutes). The difficulty is adjusted to have a constant average target block time for the coming period."
					/>

					<Parameter
						_key="minDiffCorrFact"
						value={params.minDiffCorrFact}
						info="Lower bound to the difficulty correction factor during an adjustment (new difficulty = difficulty * correction factor)."
					/>

					<Parameter
						_key="maxDiffCorrFact"
						value={params.maxDiffCorrFact}
						info="Upper bound to the difficulty correction factor during an adjustment (new difficulty = difficulty * correction factor)."
					/>

					<Parameter
						_key="blkMaturity"
						value={params.blkMaturity}
						info="How many confirmations does a block need to be considered mature."
					/>
					<Parameter
						_key="hardCap"
						value={params.hardCap.toLocaleString()}
						info="Maximum supply cap expressed in the smallest denomination. Calculated as the infinite sum of (blkRewardHalflife * initBlkReward) / 2 ^ n"
					/>
					<Parameter
						_key="derivPurpose"
						value={params.derivPurpose}
						info="The purpose in the bip-44 derivation path."
					/>
					<Parameter
						_key="derivCoinType"
						value={params.derivCoinType}
						info="bip-44 derivation path coin type."
					/>
				</div>
			</section>
		</main>
	);
};

export default ParametersPage;
