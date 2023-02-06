package main

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) ExportToJSON(ctx context.Context) {
	runtime.EventsEmit(ctx, "onExportToJSON")
}

func (a *App) OnSaveFile(ctx context.Context) {
	runtime.EventsEmit(ctx, "onSaveFile")
}

func (a *App) OnLoadFile(ctx context.Context) {
	runtime.EventsEmit(ctx, "onLoadFile")
}

func (a *App) SaveFile(data string, filename string) string {
	homedir, err := os.UserHomeDir()

	if err != nil {
		return "Error ocured while getting the home directory."
	}

	if strings.HasSuffix(filename, ".template") {
		filename, _, _ = strings.Cut(filename, ".template")
	}

	filepath, _ := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		DefaultDirectory:           homedir,
		CanCreateDirectories:       true,
		ShowHiddenFiles:            false,
		DefaultFilename:            fmt.Sprintf("%s.template.json", filename),
		Title:                      "Save the JSON template.",
		TreatPackagesAsDirectories: false,
		Filters: []runtime.FileFilter{
			{
				DisplayName: "JSON",
				Pattern:     "*.json",
			},
		},
	})

	err = os.WriteFile(filepath, []byte(data), 0777)

	if err != nil {
		return "Error ocured while saving the file."
	}

	return "File saved successfully."
}

func (a *App) LoadFile() string {
	homedir, err := os.UserHomeDir()

	if err != nil {
		return "Error ocured while getting the home directory."
	}

	filepath, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		DefaultDirectory:           homedir,
		CanCreateDirectories:       false,
		ShowHiddenFiles:            false,
		Title:                      "Load the JSON template.",
		TreatPackagesAsDirectories: false,
		Filters: []runtime.FileFilter{
			{
				DisplayName: "JSON",
				Pattern:     "*.json",
			},
		},
	})

	if err != nil {
		return "Error ocured while loading the file."
	}

	file, err := os.ReadFile(filepath)

	if err != nil {
		return "Error ocured while reading the file."
	}

	return string(file)
}
