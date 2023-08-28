using System.Collections.Generic;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Altinn.Studio.Designer.Models;
using JetBrains.Annotations;

namespace Altinn.Studio.Designer.Services.Interfaces
{
    public interface IAppDevelopmentService
    {
        /// <summary>
        /// Gets a list of FormLayouts for layoutset. Use null as layoutSetName for apps that does not use layoutset.
        /// </summary>
        /// <param name="altinnAppContext">Context of an app.</param>
        /// <param name="layoutSetName">Name of layoutset. Is null of app does not use layoutset</param>
        /// <returns>A list of all FormLayouts for a layoutset</returns>
        public Task<Dictionary<string, JsonNode>> GetFormLayouts(AltinnAppContext altinnAppContext, [CanBeNull] string layoutSetName);

        /// <summary>
        /// Saves the form layout for a specific layoutname. If app-structure
        /// without layoutset is used, use null as layoutsetname
        /// </summary>
        /// <param name="altinnAppContext">Context of an app.</param>
        /// <param name="layoutSetName">Name of layoutset. Is null of app does not use layoutset</param>
        /// <param name="layoutName">Name of layout file</param>
        /// <param name="formLayout">Actual content of layout file</param>
        /// <returns></returns>
        public Task SaveFormLayout(AltinnAppContext altinnAppContext, [CanBeNull] string layoutSetName, string layoutName, JsonNode formLayout);

        /// <summary>
        /// Delete the form layout for a specific layoutname. If app-structure
        /// without layoutset is used, use null as layoutsetname
        /// </summary>
        /// <param name="altinnAppContext">Context of an app.</param>
        /// <param name="layoutSetName">Name of layoutset. Is null of app does not use layoutset</param>
        /// <param name="layoutName">Name of layout file</param>
        /// <returns></returns>
        public void DeleteFormLayout(AltinnAppContext altinnAppContext, [CanBeNull] string layoutSetName, string layoutName);

        /// <summary>
        /// Updates the name of a layout file
        /// </summary>
        /// <param name="altinnAppContext">Context of an app.</param>
        /// <param name="layoutSetName">Name of layoutset. Is null of app does not use layoutset</param>
        /// <param name="layoutName">Name of layout file</param>
        /// <param name="newName">The new name of the layout file</param>
        public void UpdateFormLayoutName(AltinnAppContext altinnAppContext, [CanBeNull] string layoutSetName, string layoutName, string newName);

        /// <summary>
        /// Gets LayoutSettings for layoutset. Use null as layoutSetName for apps that does not use layoutset.
        /// </summary>
        /// <param name="altinnAppContext">Context of an app.</param>
        /// <param name="layoutSetName">Name of layoutset. Is null of app does not use layoutset</param>
        /// <returns>JsonNode for layoutset</returns>
        public Task<JsonNode> GetLayoutSettings(AltinnAppContext altinnAppContext, [CanBeNull] string layoutSetName);

        /// <summary>
        /// Save LayoutSettings for layoutset. Use null as layoutSetName for apps that does not use layoutset.
        /// </summary>
        /// <param name="altinnAppContext">Context of an app.</param>
        /// <param name="layoutSettings">The layoutSettings to be saved</param>
        /// <param name="layoutSetName">Name of layoutset. Is null of app does not use layoutset</param>
        public Task SaveLayoutSettings(AltinnAppContext altinnAppContext, JsonNode layoutSettings, [CanBeNull] string layoutSetName);

        /// <summary>
        /// Gets an array of all layoutsets for layout-sets.json. If no sets returns null.
        /// </summary>
        /// <param name="altinnAppContext">Context of an app.</param>
        public Task<LayoutSets> GetLayoutSets(AltinnAppContext altinnAppContext);

        /// <summary>
        /// Creates a layout-sets.json file
        /// </summary>
        /// <param name="altinnAppContext">Context of an app.</param>
        /// <param name="layoutSetName">The name of the layout set.</param>
        public Task<LayoutSets> ConfigureLayoutSet(AltinnAppContext altinnAppContext, [CanBeNull] string layoutSetName);

        /// <summary>
        /// Adds a config for an additional layoutset to the layout-set.json
        /// </summary>
        /// <param name="altinnAppContext">Context of an app.</param>
        /// <param name="layoutSet">Config for the new layoutset</param>
        public Task AddLayoutSet(AltinnAppContext altinnAppContext, LayoutSetConfig layoutSet);

        /// <summary>
        /// Gets the rule handler for a specific organization, application, developer, and layout set name.
        /// </summary>
        /// <param name="altinnAppContext">Context of an app.</param>
        /// <param name="layoutSetName">The name of the layout set.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the rule handler as a string.</returns>
        public Task<string> GetRuleHandler(AltinnAppContext altinnAppContext, [CanBeNull] string layoutSetName);

        /// <summary>
        /// Saves the rule handler for a specific organization, application, developer, rule handler, and layout set name.
        /// </summary>
        /// <param name="altinnAppContext">Context of an app.</param>
        /// <param name="ruleHandler">The rule handler to save.</param>
        /// <param name="layoutSetName">The name of the layout set.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public Task SaveRuleHandler(AltinnAppContext altinnAppContext, string ruleHandler, [CanBeNull] string layoutSetName);

        /// <summary>
        /// Gets the rule configuration for a specific organization, application, developer, and layout set name.
        /// </summary>
        /// <param name="altinnAppContext">Context of an app.</param>
        /// <param name="layoutSetName">The name of the layout set.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the rule configuration as a string.</returns>
        public Task<string> GetRuleConfigAndAddDataToRootIfNotAlreadyPresent(AltinnAppContext altinnAppContext, [CanBeNull] string layoutSetName);

        /// <summary>
        /// Saves the rule configuration for a specific organization, application, developer, rule configuration, and layout set name.
        /// </summary>
        /// <param name="altinnAppContext">An <see cref="AltinnAppContext"/></param>
        /// <param name="ruleConfig">The rule configuration to save.</param>
        /// <param name="layoutSetName">The name of the layout set.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public Task SaveRuleConfig(AltinnAppContext altinnAppContext, JsonNode ruleConfig, [CanBeNull] string layoutSetName);

        /// <summary>
        /// Get's process definition for an app.
        /// </summary>
        /// <param name="altinnAppContext">Context of an app.</param>
        /// <returns>Bpmn file.</returns>
        public Task<string> GetProcessDefinition(AltinnAppContext altinnAppContext);

        /// <summary>
        /// Saves the process definition for an app.
        /// </summary>
        /// <param name="altinnAppContext">Context of an app holding name of the organization, name of the app and developer.</param>
        /// <param name="bpmnXml">Content of process definition file to save.</param>
        /// <returns>Saved file.</returns>
        public Task<string> SaveProcessDefinition(AltinnAppContext altinnAppContext, string bpmnXml);
    }
}
