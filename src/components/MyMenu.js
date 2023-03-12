// src/Menu/Menu.js
import React from "react";
import atomize from "@quarkly/atomize";
import { useRouteMatch } from "react-router-dom";
import { useMatch } from "@reach/router";
import { Link } from "@quarkly/widgets";
import { useOverrides } from "@quarkly/components"; // src/Menu/utils.js

var FILTER_MODES = Object.freeze({
	exclude: "exclude",
	include: "include"
});
var PageTreeNode = class {
	static fromPages(pages) {
		return this._fromPages(pages);
	}

	static _fromPages(pages, rootID = "root", baseURL = "") {
		const node = pages[rootID];
		const childNodes = node.children;
		const result = new PageTreeNode();
		result.id = node.id;
		result.name = node.name;
		result.pageUrl = node.pageUrl;
		result.absoluteUrl = rootID !== "root" ? `${baseURL}/${node.pageUrl}` : "";

		if (childNodes) {
			result.children = childNodes.map(el => this._fromPages(pages, el, result.absoluteUrl));
		}

		return result;
	}

	findSubtreeByUrl(url) {
		const result = this._findSubtreeByUrl(url);

		if (!result) {
			console.warn(`Unexpected! Url ${url} not found!`);
			return this;
		}

		return result;
	}

	_findSubtreeByUrl(url) {
		if (this.absoluteUrl === url) {
			return this;
		}

		if (this.children) {
			let result = null;
			this.children.some(el => {
				result = el._findSubtreeByUrl(url);
				return result;
			});
			return result;
		}

		return null;
	}

	filterByPages(mode, pages) {
		switch (mode) {
			case FILTER_MODES.exclude:
				if (this.children) {
					this.children = this.children.flatMap(el => {
						if (pages.includes(el.absoluteUrl)) {
							return [];
						}

						if (el.children) {
							el = el.filterByPages(mode, pages);
						}

						return [el];
					});
				}

				return this;

			case FILTER_MODES.include:
				if (this.children) {
					this.children = this.children.flatMap(el => {
						if (el.children) {
							el = el.filterByPages(mode, pages);
						}

						if (pages.includes(el.absoluteUrl) || el?.children?.length > 0) {
							return [el];
						}

						return [];
					});
				}

				return this;

			default:
				console.warn("Unexpected mode");
				return this;
		}
	}

	truncate(depth) {
		return this._trunc(depth, 0);
	}

	_trunc(depth, level = 0) {
		if (this.children) {
			this.children = this.children.flatMap(el => {
				if (level >= depth) {
					return [];
				}

				return [el._trunc(depth, level + 1)];
			});
		}

		return this;
	}

}; // src/Menu/props/propsInfo.js

var propsInfo_default = {
	depth: {
		title: {
			en: "Maximum nesting",
			ru: "Максимальная вложенность"
		},
		control: "input",
		type: "number",
		category: "Main",
		weight: 1
	},
	rootId: {
		title: {
			en: "Root page",
			ru: "Корневая страница"
		},
		control: "page",
		category: "Main",
		weight: 1
	},
	"exact-active-match": {
		title: {
			en: "Don't mark parent active items",
			ru: "Не выделять родительские активные пункты"
		},
		control: "checkbox",
		category: "Main",
		weight: 1
	},
	filterMode: {
		title: {
			en: "Filter mode",
			ru: "Режим фильтрации"
		},
		control: "radio-group",
		variants: [{
			title: {
				en: "Hide pages",
				ru: "Скрыть страницы"
			},
			value: FILTER_MODES.exclude
		}, {
			title: {
				en: "Show only selected pages",
				ru: "Показать страницы"
			},
			value: FILTER_MODES.include
		}],
		category: "Pages",
		weight: 1
	},
	filterPages: {
		title: {
			en: "Filter pages",
			ru: "Список страниц"
		},
		control: "page",
		multiply: true,
		category: "Pages",
		weight: 1
	}
}; // src/Menu/props/propsDefault.js

var propsDefault_default = {
	depth: 1,
	rootId: "",
	"exact-active-match": true,
	filterMode: FILTER_MODES.exclude
}; // src/Menu/props/overrides.js

var overrides_default = {
	item: {
		props: {
			padding: "6px 12px",
			margin: "0px 0px"
		}
	},
	sub: {
		props: {
			padding: "6px 6px",
			margin: "0px 0px",
			"list-style": "none"
		}
	},
	"item-404": {
		props: {
			display: "none"
		}
	},
	"item-active": {},
	link: {
		kind: "Link",
		props: {
			color: "--primary"
		}
	},
	"link-active": {
		kind: "Link",
		props: {
			color: "--dark"
		}
	}
}; // src/utils/getAPI.js

var getAPI = () => {
	if (typeof window !== "undefined") {
		return window.QAPI || {};
	}

	if (typeof global !== "undefined") {
		return global.QAPI || {};
	}

	return {};
};

var getAPI_default = getAPI; // src/Menu/Menu.js

var Ul = atomize.ul();
var Li = atomize.li();

var Item = ({
	exact = false,
	override,
	item
}) => {
	const hasSub = !!item?.children?.length;
	const common = {
		exact,
		override,
		item
	};
	const {
		projectType
	} = getAPI_default() || {};
	const href = item.absoluteUrl;
	let match = null;

	if (projectType === "gatsby") {
		match = useMatch(href) || null;
	} else {
		match = useRouteMatch({
			path: href,
			exact
		}) || null;
	}

	const {
		name,
		pageUrl
	} = item;
	const linkProps = override("link", match && "link-active", `link-${pageUrl}`);
	return <Li {...override("item", match && "item-active", `item-${pageUrl}`)}>
		    
		<Link href={href} {...linkProps}>
			{linkProps.children || name}
		</Link>
		    
		{hasSub && <Wrapper tree={item} {...common} {...override("sub", `sub-${pageUrl}`)} />}
		  
	</Li>;
};

var Wrapper = ({
	override,
	exact,
	tree,
	...rest
}) => {
	const common = {
		override,
		exact,
		tree
	};
	const list = tree?.children ?? [];
	return <Ul {...rest}>
		{list.map(item => <Item key={item.id} item={item} {...common} />)}
	</Ul>;
};

var Menu = ({
	rootId: rootUrl = "",
	depth,
	filterMode,
	filterPages: origFilterPages,
	"exact-active-match": exact,
	...props
}) => {
	const {
		override,
		rest
	} = useOverrides(props, overrides_default, propsDefault_default);
	const pages = getAPI_default().pages || {};
	const filterPages = origFilterPages?.length > 0 ? origFilterPages.split(",") : [];
	const tree = PageTreeNode.fromPages(pages).findSubtreeByUrl(rootUrl).filterByPages(filterMode, filterPages).truncate(depth);
	return <Wrapper
		tree={tree}
		depth={depth}
		exact={exact}
		override={override}
		padding="6px"
		margin="0px"
		list-style="none"
		{...rest}
	/>;
};

Object.assign(Menu, {
	title: "Menu",
	description: {
		en: "Use this component to add a simple menu to your website",
		ru: "Простое меню для вашего сайта"
	},
	defaultProps: propsDefault_default,
	overrides: overrides_default,
	propInfo: propsInfo_default
});
var Menu_default = Menu;
export { Menu_default as default };