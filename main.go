package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	MainMenu := menu.NewMenu()
	MainMenu.Append(menu.AppMenu())
	FileMenu := MainMenu.AddSubmenu("File")
	FileMenu.AddText("New file", keys.CmdOrCtrl("n"), func(cd *menu.CallbackData) {
		app.OnNewFile(app.ctx, false)
	})
	FileMenu.AddText("New empty file", keys.Combo("n", keys.CmdOrCtrlKey, keys.ShiftKey), func(cd *menu.CallbackData) {
		app.OnNewFile(app.ctx, true)
	})
	FileMenu.AddSeparator()
	FileMenu.AddText("Open file...", keys.CmdOrCtrl("o"), func(cd *menu.CallbackData) {
		app.OnLoadFile(app.ctx)
	})
	FileMenu.AddSeparator()
	FileMenu.AddText("Save...", keys.CmdOrCtrl("s"), func(cd *menu.CallbackData) {
		app.OnSaveFile(app.ctx)
	})
	FileMenu.AddSeparator()
	FileMenu.AddText("Export to JSON", keys.CmdOrCtrl("e"), func(cd *menu.CallbackData) {
		app.ExportToJSON(app.ctx)
	})
	MainMenu.Append(menu.EditMenu())

	// go:embed appicon.png
	icon, errr := embed.FS.ReadFile(assets, "appicon.png")

	if errr != nil {
		println("Error:", errr.Error())
	}

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "MTRGen Template Creator",
		Width:     1024,
		Height:    768,
		MinWidth:  720,
		MinHeight: 440,
		MaxWidth:  960,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 0},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		Menu: MainMenu,
		Mac: &mac.Options{
			TitleBar: &mac.TitleBar{
				TitlebarAppearsTransparent: false,
			},
			Appearance:           mac.NSAppearanceNameDarkAqua,
			WebviewIsTransparent: true,
			WindowIsTranslucent:  false,
			About: &mac.AboutInfo{
				Title:   "MTRGen Template Creator",
				Message: "Generate JSON, YAML or NEON templates for MTRGen to generate PHP files from.\n\nMatronator © 2021",
				Icon:    icon,
			},
		},
		Linux: &linux.Options{
			Icon:                icon,
			WindowIsTranslucent: false,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
