﻿using System.Collections.Generic;
using System.Net.Http;
using System;
using Altinn.Studio.Designer.Models;
using PolicyAdmin.Models;
using System.Threading.Tasks;
using Altinn.Authorization.ABAC.Xacml;
using Altinn.Authorization.ABAC.Utils;
using System.IO;
using System.Xml;
using Altinn.ResourceRegistry.Core.Models.Altinn2;

namespace Altinn.Studio.Designer.TypedHttpClients.Altinn2Metadata
{
    public class Altinn2MetadataClient : IAltinn2MetadataClient
    {
        private readonly HttpClient _httpClient;

        public Altinn2MetadataClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<ServiceResource> GetServiceResourceFromService(string serviceCode, int serviceEditionCode, string environment)
        {
            // Temp location. Will be moved to CDN
            string url = $"https://at23.altinn.cloud/sblbridge/metadata/api/resourceregisterresource?serviceCode={serviceCode}&serviceEditionCode={serviceEditionCode}";

            ServiceResource serviceResource;

            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync(url);
                string contentString = await response.Content.ReadAsStringAsync();
                serviceResource = System.Text.Json.JsonSerializer.Deserialize<ServiceResource>(contentString);
                return serviceResource;
            }
            catch (Exception ex)
            {
                throw new Exception($"Something went wrong when retrieving service resource", ex);
            }
        }

        public async Task<XacmlPolicy> GetXacmlPolicy(string serviceCode, int serviceEditionCode, string identifier, string environment)
        {
            string url = $"https://at23.altinn.cloud/sblbridge/authorization/api/resourcepolicyfile?serviceCode={serviceCode}&serviceEditionCode={serviceEditionCode}&identifier={identifier}";

            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync(url);
                string contentString = await response.Content.ReadAsStringAsync();
                XacmlPolicy policy;
                using (XmlReader reader = XmlReader.Create(new StringReader(contentString)))
                {
                    policy = XacmlParser.ParseXacmlPolicy(reader);
                }

                return policy;
            }
            catch (Exception ex)
            {
                throw new Exception($"Something went wrong when retrieving service resource", ex);
            }

            return null;

        }

        public async Task<List<AvailableService>> AvailableServices(int languageId, string environment)
        {
            List<AvailableService>? availableServices = null;
            string availabbleServicePath = $"https://at23.altinn.cloud/sblbridge/metadata/api/availableServices?languageID={languageId}&appTypesToInclude=0&includeExpired=false";

            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync(availabbleServicePath);

                string availableServiceString = await response.Content.ReadAsStringAsync();
                if (!string.IsNullOrEmpty(availableServiceString))
                {
                    availableServices = System.Text.Json.JsonSerializer.Deserialize<List<AvailableService>>(availableServiceString, new System.Text.Json.JsonSerializerOptions());
                }

                return availableServices;
            }
            catch (Exception ex)
            {
                throw new Exception($"Something went wrong when retrieving Action options", ex);
            }
        }

    }
}
