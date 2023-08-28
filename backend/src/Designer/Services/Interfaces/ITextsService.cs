using System.Collections.Generic;
using System.Threading.Tasks;
using Altinn.Studio.Designer.Models;

namespace Altinn.Studio.Designer.Services.Interfaces
{
    /// <summary>
    /// Interface for handling texts in new format.
    /// </summary>
    public interface ITextsService
    {

        /// <summary>
        /// Creates the default text resource file in old text format with appName
        /// </summary>
        /// <param name="altinnAppContext">An <see cref="AltinnAppContext"/></param>
        public Task CreateLanguageResources(AltinnAppContext altinnAppContext);

        /// <summary>
        /// Returns the app languages
        /// </summary>
        /// <param name="altinnAppContext">An <see cref="AltinnAppContext"/></param>
        /// <returns>The text</returns>
        public List<string> GetLanguages(AltinnAppContext altinnAppContext);

        /// <summary>
        /// Gets texts file in old format in app repository according to
        /// specified languageCode.
        /// </summary>
        /// <param name="altinnAppContext">An <see cref="AltinnAppContext"/></param>
        /// <param name="languageCode">LanguageCode</param>
        /// <returns>The text file</returns>
        public Task<TextResource> GetTextV1(AltinnAppContext altinnAppContext, string languageCode);

        /// <summary>
        /// Saves text resource in old format.
        /// </summary>
        /// <param name="altinnAppContext">An <see cref="AltinnAppContext"/></param>
        /// <param name="textResource">The text resource to be saved</param>
        /// <param name="languageCode">LanguageCode</param>
        /// <returns></returns>
        public Task SaveTextV1(AltinnAppContext altinnAppContext, TextResource textResource, string languageCode);

        /// <summary>
        /// Gets texts file in app repository according to
        /// specified languageCode.
        /// </summary>
        /// <param name="altinnAppContext">An <see cref="AltinnAppContext"/></param>
        /// <param name="languageCode">LanguageCode</param>
        /// <returns>The text file as a dictionary with ID and text as key:value pairs</returns>
        public Task<Dictionary<string, string>> GetTextsV2(AltinnAppContext altinnAppContext, string languageCode);

        /// <summary>
        /// Gets all keys in use across the languages.
        /// </summary>
        /// <param name="altinnAppContext">An <see cref="AltinnAppContext"/></param>
        /// <param name="languages">List of languages in application</param>
        /// <returns>The text file as a dictionary with ID and text as key:value pairs</returns>
        public Task<List<string>> GetKeys(AltinnAppContext altinnAppContext, IList<string> languages);

        /// <summary>
        /// Updates values for
        /// </summary>
        /// <param name="altinnAppContext">An <see cref="AltinnAppContext"/></param>
        /// <param name="keysTexts"></param>
        /// <param name="languageCode"></param>
        /// <returns></returns>
        public Task UpdateTextsForKeys(AltinnAppContext altinnAppContext, Dictionary<string, string> keysTexts, string languageCode);

        /// <summary>
        /// Edit texts file for specific language by overwriting old text file.
        /// </summary>
        /// <param name="altinnAppContext">An <see cref="AltinnAppContext"/></param>
        /// <param name="languageCode">LanguageCode</param>
        /// <param name="jsonTexts">Text to be added to new text file</param>
        public Task UpdateTexts(AltinnAppContext altinnAppContext, string languageCode, Dictionary<string, string> jsonTexts);

        /// <summary>
        /// Deletes texts file for a specific language.
        /// </summary>
        /// <param name="altinnAppContext">An <see cref="AltinnAppContext"/></param>
        /// <param name="languageCode">LanguageCode to identify the specific text file.</param>
        public void DeleteTexts(AltinnAppContext altinnAppContext, string languageCode);

        /// <summary>
        /// Converts all texts files in a specific repository for a specific organisation.
        /// </summary>
        /// <param name="altinnAppContext">An <see cref="AltinnAppContext"/></param>
        public Task ConvertV1TextsToV2(AltinnAppContext altinnAppContext);

        /// <summary>
        /// Updates an old key to a new key in all texts files.
        /// If 'newKey' is undefined the 'oldKey' is deleted.
        /// </summary>
        /// <param name="altinnAppContext">An <see cref="AltinnAppContext"/></param>
        /// <param name="languages">All languages that must be updated with new key</param>
        /// <param name="oldKey">The old key that will be replaced</param>
        /// <param name="newKey">The new key to replace the old</param>
        public Task<string> UpdateKey(AltinnAppContext altinnAppContext, IList<string> languages, string oldKey, string newKey);

        /// <summary>
        /// Updates references to text keys in layout files.
        /// </summary>
        /// <param name="altinnAppContext">An <see cref="AltinnAppContext"/></param>
        /// <param name="keyMutations">A list of the keys that are updated</param>
        /// <returns></returns>
        public Task UpdateRelatedFiles(AltinnAppContext altinnAppContext, List<TextIdMutation> keyMutations);
    }
}
