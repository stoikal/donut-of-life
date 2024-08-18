type CreateButtonParams = {
  label: string
  onClick: (e: Event) => void
}

type ControlsOptions = {
  onDecrease: () => void
  onIncrease: () => void
}

class Controls {
  domElement: HTMLDivElement

  constructor ({ onDecrease, onIncrease }: ControlsOptions) {
    const containerEl = this.#createContainerEl()
    const decreaseBtnEl = this.#createButtonEl({
      label: "-",
      onClick: onDecrease,
    })
    const increaseBtnEl = this.#createButtonEl({
      label: "+",
      onClick: onIncrease,
    })

    containerEl.appendChild(decreaseBtnEl)
    containerEl.appendChild(increaseBtnEl)

    this.domElement = containerEl
  }

  #createContainerEl () {
    const container = document.createElement("div")

    container.style.position = "absolute"
    container.style.left = "50%"
    container.style.bottom = "16px"
    container.style.transform = "translateX(-50%)"
    container.style.display = "flex"
    container.style.gap = "12px"

    return container
  }

  #createButtonEl (options: CreateButtonParams) {
    const button = document.createElement("button")
    button.style.minHeight = "44px"
    button.style.minWidth = "44px"
    button.style.fontSize = "20px"
    button.type = "button"
    button.textContent = options.label
    button.addEventListener("click", options.onClick)
  
    return button
  }
}

export default Controls
