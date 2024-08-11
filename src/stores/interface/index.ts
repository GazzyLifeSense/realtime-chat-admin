/* GlobalState */
export interface GlobalState {
	token: string;
	userInfo: any;
	themeConfig: ThemeConfigProps;
}

/* themeConfigProp */
export interface ThemeConfigProps {
	isCollapse: boolean;
}

/* AuthState */
export interface AuthState {
	authMenuList: Menu.MenuOptions[];
}

/* keepAliveState */
export interface keepAliveState {
	keepAliveName: string[];
}