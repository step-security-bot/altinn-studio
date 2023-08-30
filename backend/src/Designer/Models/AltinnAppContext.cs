using System;
using System.Text.RegularExpressions;
using Altinn.Studio.Designer.Helpers;

namespace Altinn.Studio.Designer.Models
{
    /// <summary>
    /// Context of an app. Holding information about org, app and developer
    /// </summary>
    public class AltinnAppContext: AltinnRepo
    {
        /// <summary>
        /// The user name of the developer working on the repository.
        /// </summary>
        public string Developer { get; }

        public AltinnAppContext(string org, string app, string developer): base(org, app)
        {
            ValidateDeveloper(developer);
            Developer = developer;
        }

        private static void ValidateDeveloper(string developer)
        {
            if (!Regex.IsMatch(developer, "^[a-zA-Z0-9][a-zA-Z0-9-_\\.]*$"))
            {
                throw new ArgumentException("Provided developer name is not valid");
            }
        }


    }
}
