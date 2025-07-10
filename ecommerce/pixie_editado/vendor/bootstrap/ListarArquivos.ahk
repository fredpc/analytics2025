#NoEnv
SetWorkingDir %A_ScriptDir%
SendMode Input

; Hotkey: Ctrl+Alt+L para executar
^!l::
    ; Solicita ao usuário selecionar um diretório
    FileSelectFolder, SelectedFolder, , 3, Selecione a pasta para listar arquivos
    if (SelectedFolder = "")
    {
        MsgBox, Nenhuma pasta selecionada.
        return
    }

    ; Gera a estrutura
    FileStructure := ListFiles(SelectedFolder)
    
    ; Copia para o clipboard
    Clipboard := FileStructure
    
    ; Mostra o resultado (opcional)
    MsgBox, Estrutura copiada para a área de transferência!`n`n%FileStructure%
return

; Função recursiva para listar arquivos
ListFiles(Folder, Indent := "") {
    Structure := ""
    
    ; Lista subpastas
    Loop, Files, %Folder%\*, D
    {
        Structure .= Indent . A_LoopFileName . "\`n"
        Structure .= ListFiles(A_LoopFileFullPath, Indent . "    ")
    }
    
    ; Lista arquivos
    Loop, Files, %Folder%\*.*, F
    {
        Structure .= Indent . A_LoopFileName . "`n"
    }
    
    return Structure
}