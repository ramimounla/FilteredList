import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;
// import * as $ from 'jquery';

export class FilteredList implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;
	private _select: HTMLDivElement;
	private _selectedTags: string[] = [];

	/**
	 * Empty constructor.
	 */
	constructor() {
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		// Add control initialization code
		this._select = document.createElement("div");
		this._select.id = "select";
		this._select.className = "selectable-tags";
		container.appendChild(this._select);

		// Add control initialization code
		this._container = document.createElement("div");
		this._container.className = "table-like";

		container.appendChild(this._container);
	}


	private sanitizeNameToCss(name: string): string {
		return name.toLowerCase().replace(' ', '-');
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view

		if (!context.parameters.recordSet.loading) {

			this._container.innerHTML = "";
			var recordSet = context.parameters.recordSet;
			let allTags: string[] = [];

			var headers = <HTMLDivElement>document.createElement("div");
			headers.className = "header";
			context.parameters.recordSet.columns.forEach(column => {
				var span = <HTMLSpanElement>document.createElement("span");
				column.displayName !== 'Tags' && (span.className = "element "); //if not equals tag
				span.innerText = column.displayName;
				headers.appendChild(span);
			});
			this._container.appendChild(headers);


			recordSet.sortedRecordIds.forEach(recordId => {
				var recordDiv = <HTMLDivElement>document.createElement("div");
				recordDiv.className = "row";
				context.parameters.recordSet.columns.forEach(column => {

					if (column.displayName == "Tags" && recordSet.records[recordId].getValue(column.name) != null) {
						var tagDiv = <HTMLDivElement>document.createElement("div");
						tagDiv.className = "tags";
						var recordTags = (<string>recordSet.records[recordId].getValue(column.name)).split(";");
						allTags = allTags.concat(recordTags);

						recordTags.forEach(tag => {
							var tagSpan = <HTMLSpanElement>document.createElement("span");
							tagSpan.className = "tag " + tag.toLowerCase().replace(' ', '-');
							tagSpan.innerText = tag;
							tagDiv.appendChild(tagSpan);
						});

						recordDiv.appendChild(tagDiv);
					}
					else {
						var span = <HTMLSpanElement>document.createElement("span");
						span.className = "element " + this.sanitizeNameToCss(column.displayName);
						span.innerText = <string>recordSet.records[recordId].getValue(column.name);
						recordDiv.appendChild(span);
					}

				});
				this._container.appendChild(recordDiv);
			});

			let uniqueTags = allTags.filter(
				(thing, i, arr) => arr.findIndex(t => t === thing) === i && thing !== ""
			);

			this._select.innerHTML = '';

			uniqueTags.forEach(tag => {
				var tagSpan = <HTMLSpanElement>document.createElement("span");
				tagSpan.className = "selectable-tag unselected " + tag.toLowerCase().replace(' ', '-');
				tagSpan.innerText = tag;

				tagSpan.addEventListener("click", (e: Event) => {
					let clickedElement = <HTMLSpanElement>e.srcElement;
					clickedElement.classList.contains('unselected') ? clickedElement.classList.remove('unselected') : clickedElement.classList.add('unselected');
					clickedElement.classList.contains('unselected') ? this._selectedTags.splice(this._selectedTags.indexOf(clickedElement.innerText), 1) : this._selectedTags.push(clickedElement.innerText);
					this.filterList();
				});

				this._select.appendChild(tagSpan);
			});

		}
	}

	private filterList(): void {

		if (this._selectedTags.length === 0) {
			Array.from(this._container.children).forEach(element => {
				if (element.className === 'header')
					return;

				(<HTMLDivElement>element).style.removeProperty("display");
			});
			return;
		}
		Array.from(this._container.children).forEach(element => {

			if (element.className === 'header')
				return;

			let tagFound = false;
			this._selectedTags.forEach(tag => {
				let sanitizedTag = tag.toLowerCase().replace(' ', '-');

				if (tagFound || element.getElementsByClassName(sanitizedTag).length > 0) {
					(<HTMLDivElement>element).style.removeProperty("display");
					tagFound = true;
					return;
				}
			});
			if (!tagFound)
				(<HTMLDivElement>element).style.display = 'none';
		});
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}
}