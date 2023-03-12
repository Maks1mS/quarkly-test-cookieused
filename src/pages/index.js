import React from "react";
import theme from "theme";
import { Theme, Link, Section, Text, Hr } from "@quarkly/widgets";
import { Helmet } from "react-helmet";
import { GlobalQuarklyPageStyles } from "global-page-styles";
import { RawHtml, Override, Menu } from "@quarkly/components";
import * as Components from "components";
export default (() => {
	return <Theme theme={theme}>
		<GlobalQuarklyPageStyles pageUrl={"index"} />
		<Helmet>
			<title>
				Quarkly export
			</title>
			<meta name={"description"} content={"Web site created using quarkly.io"} />
			<link rel={"shortcut icon"} href={"https://uploads.quarkly.io/readme/cra/favicon-32x32.ico"} type={"image/x-icon"} />
		</Helmet>
		<Section background-color="--dark" text-align="center" padding="32px 0">
			<Menu
				display="flex"
				justify-content="center"
				font="--lead"
				font-weight="700"
				margin="-6px 0 16px"
				md-flex-direction="column"
				md-align-items="center"
			>
				<Override slot="link" text-decoration="none" color="--light" padding="6px 12px" />
				<Override slot="link-active" color="--primary" />
				<Override slot="item" padding="6px 0px" />
			</Menu>
			<Link
				href="mailto:hello@company.com"
				text-decoration-line="none"
				variant="--base"
				color="--grey"
				hover-color="--primary"
			>
				hello@company.com
			</Link>
		</Section>
		<Components.QuarklycommunityKitMenu />
		<Components.MyCookieUsed />
		<Text margin="0px 0px 0px 0px" font="--headline3">
			Full menu
		</Text>
		<Components.MyMenu depth="2" filterMode="exclude" />
		<Text margin="0px 0px 0px 0px" font="--headline3">
			Hide pages
		</Text>
		<Components.MyMenu filterPages="/404,/pagea" filterMode="include" />
		<Text margin="0px 0px 0px 0px" font="--headline3">
			Show only pages
		</Text>
		<Components.MyMenu depth="2" filterMode="exclude" filterPages=",/pagea/mypage" />
		<Hr
			min-height="10px"
			min-width="100%"
			margin="0px 0px 0px 0px"
			background="#130202"
			sm-height="30px"
		/>
		<Components.QuarklycommunityKitMenu filterMode="include" filterPages=",/test,/pagea" />
		<RawHtml>
			<style place={"endOfHead"} rawKey={"62e1874ec4aee700186f81d2"}>
				{":root {\n  box-sizing: border-box;\n}\n\n* {\n  box-sizing: inherit;\n}"}
			</style>
		</RawHtml>
	</Theme>;
});