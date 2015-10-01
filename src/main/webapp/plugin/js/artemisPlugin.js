/**
 * @module ARTEMIS
 * @main ARTEMIS
 *
 * The main entrypoint for the ARTEMIS module
 *
 */
var ARTEMIS = (function(ARTEMIS) {

   /**
    * @property pluginName
    * @type {string}
    *
    * The name of this plugin
    */
   ARTEMIS.pluginName = "ARTEMIS";

   /**
    * @property log
    * @type {Logging.Logger}
    *
    * This plugin's logger instance
    */
   ARTEMIS.log = Logger.get(ARTEMIS.pluginName);

   /**
    * @property templatePath
    * @type {string}
    *
    * The top level path to this plugin's partials
    */
   ARTEMIS.templatePath = "../artemis-plugin/plugin/html/";

   /**
    * @property jmxDomain
    * @type {string}
    *
    * The JMX domain this plugin mostly works with
    */
   ARTEMIS.jmxDomain = "hawtio"

   /**
    * @property mbeanType
    * @type {string}
    *
    * The mbean type this plugin will work with
    */
   ARTEMIS.mbeanType = "ARTEMISHandler";

   /**
    * @property mbean
    * @type {string}
    *
    * The mbean's full object name
    */
   ARTEMIS.mbean = ARTEMIS.jmxDomain + ":type=" + ARTEMIS.mbeanType;

   /**
    * @property SETTINGS_KEY
    * @type {string}
    *
    * The key used to fetch our settings from local storage
    */
   ARTEMIS.SETTINGS_KEY = 'ARTEMISSettings';

   /**
    * @property module
    * @type {object}
    *
    * This plugin's angularjs module instance
    */
   ARTEMIS.module = angular.module(ARTEMIS.pluginName, ['bootstrap', 'ngResource', 'ui.bootstrap.dialog', 'hawtioCore', 'camel', 'hawtio-ui']);

   // set up the routing for this plugin
   ARTEMIS.module.config(function($routeProvider) {
      $routeProvider
         .when('/artemis/createDestination', {
            templateUrl: ARTEMIS.templatePath + 'createDestination.html'
         })
         .when('/artemis/deleteQueue', {
            templateUrl: ARTEMIS.templatePath + 'deleteQueue.html'
         });
   });

   // one-time initialization happens in the run function
   // of our module
   ARTEMIS.module.run(function(workspace, viewRegistry, localStorage, jolokia, ARTEMISService, $rootScope) {
      // let folks know we're actually running
      ARTEMIS.log.info("plugin running " + jolokia);

      ARTEMISService.initArtemis();

      // tell hawtio that we have our own custom layout for
      // our view
      viewRegistry["artemis"] = ARTEMIS.templatePath + "artemisLayout.html";

      // Add a top level tab to hawtio's navigation bar
      workspace.topLevelTabs.push({
         id: "artemis",
         content: "Artemis",
         title: "example ARTEMIS client",
         isValid: function(workspace) { return workspace.treeContainsDomainAndProperties("org.apache.activemq.artemis");},
         href: function() { return "#/jmx/attributes?tab=artemis"; },
         isActive: function() { return workspace.isLinkActive("artemis"); }
      });

      workspace.subLevelTabs.push({
         content: '<i class="icon-plus"></i> Create',
         title: "Create a new destination",
         isValid: function(workspace) { return workspace.treeContainsDomainAndProperties("org.apache.activemq.artemis"); },
         href: function() { return "#/artemis/createDestination"; }
      });


      workspace.subLevelTabs.push({
         content: '<i class="icon-remove"></i> Delete',
         title: "Delete or purge this queue",
         isValid: function(workspace) { return true },
         href: function() { return  "#/artemis/deleteQueue"}
      });
   });

   return ARTEMIS;
}(ARTEMIS || {}));

// Very important!  Add our module to hawtioPluginLoader so it
// bootstraps our module
hawtioPluginLoader.addModule(ARTEMIS.pluginName);