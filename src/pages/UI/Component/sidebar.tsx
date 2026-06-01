import React from "react";
import { down_arrow_icon, inventory_management, inventory_management_active, lockIcon, lockIcon_gray, logo, setting_icon, setting_icon_active } from "../../../assets/images";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

function DesignerSidebar() {

  return (
    <>
      <nav className="main-navigation" >
      <a href="#" title="MAS Prime" className="logo"> <img src={logo} alt="Logo" /></a>
        <div className="menu-wrapper">
          <Accordion>
            <AccordionSummary
              expandIcon={<img src={down_arrow_icon} alt="down_arrow_icon" />
            }
              className="has-submenu"
            >
              <a href="#" title="Entity Management" className="menu-link">
                <em className="thumb-i">
                  <img src={inventory_management} alt="inventory_management" />
                  <img src={inventory_management_active} alt="inventory_management" className="overlap" />
                </em>
                <span>Entity Management</span>
              </a>
            </AccordionSummary>
            <AccordionDetails>
              <ul className="sub-menu">
                  <li>
                    <a href="/designer/acquiring-transactions" title="Acquiring Transition" className="menu-link">Acquiring Transactions</a>
                  </li>
                  <li>
                    <a href="/designer/merchant-transaction/add" title="Add Manual Merchant Transition" className="menu-link">Add Manual Merchant Transactions</a>
                  </li>
                  <li>
                    <a href="/designer/non-merchant-transaction/add" title="Add Manual Non Activity Fee Transition" className="menu-link">Add Manual non activity fee Transactions</a>
                  </li>
                  <li>
                    <a href="/designer/merchant-transaction/list" title="Manual Acquiring Transition" className="menu-link">Manual Acquiring Transactions</a>
                  </li>
                  <li>
                    <a href="/designer/non-merchant-transaction/list" title="Manual Non Activity Fees Transition" className="menu-link">Manual Non Activity Fees Transactions</a>
                  </li>
                  <li>
                    <a href="/designer/non-activity-fee-query" title="Query Non Activity Fees" className="menu-link">Query Non Activity Fees</a>
                  </li>
              </ul>    
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<img src={down_arrow_icon} alt="down_arrow_icon" />
              }
              className="has-submenu"
            >
              <a href="#" title="Configuration" className="menu-link">
                <em className="thumb-i">
                  <img src={setting_icon} alt="inventory_management" />
                  <img src={setting_icon_active} alt="inventory_management" className="overlap" />
                </em>
                <span>Configuration</span>
              </a>
            </AccordionSummary>
            <AccordionDetails>
              <ul className="sub-menu">
                <li>
                  <a href="/designer/institution/list" title="Institutions" className="menu-link">Institutions</a>
                </li>
                <li>
                  <a href="/designer/activity-fees-packages/list" title="Activity Fees Pkgs" className="menu-link">Activity Fees Pkgs</a>
                </li>
                <li>
                  <a href="/designer/non-activity-fees-packages/list" title="Non Activity Fees" className="menu-link">Non Activity Fees</a>
                </li>
                <li>
                  <a href="/designer/employees" title="Employees" className="menu-link">Employees</a>
                </li>
                <li>
                  <a href="/designer/currency/list" title="Currency" className="menu-link">Currency</a>
                </li>
                <li>
                  <a href="/designer/currency-conversion" title="Currency Conversion" className="menu-link">Currency Conversion</a>
                </li>
                <li>
                  <a href="/designer/currency-rate" title="Currency Rate" className="menu-link">Currency Rate</a>
                </li>
                <li>
                  <a href="/designer/mcc" title="MCC" className="menu-link">MCC</a>
                </li>
                <li>
                  <a href="/designer/card-scheme/list" title="Card Scheme" className="menu-link">Card Scheme</a>
                </li>
                <li>
                  <a href="#" title="Issuer" className="menu-link">Issuer</a>
                </li>
                <li>
                  <a href="/designer/manage-countries" title="Country" className="menu-link">Country</a>
                </li>
                <li>
                  <a href="/designer/transaction-group" title="Transaction Group" className="menu-link">Transaction Group</a>
                </li>
                <li>
                  <a href="/designer/terminal-type" title="Terminals" className="menu-link">Terminals</a>
                </li>
                <li>
                  <a href="/designer/contacts" title="Contacts" className="menu-link">Contacts</a>
                </li>
              </ul>
            </AccordionDetails>
          </Accordion>
          <Accordion className="not-expanded">
            <AccordionSummary>
              <a href="#" title="Entity Management" className="menu-link">
                <em className="thumb-i">
                  <img src={lockIcon_gray} alt="inventory_management" />
                  <img src={lockIcon} alt="inventory_management" className="overlap" />
                </em>
                <span>Security</span>
              </a>
            </AccordionSummary>
          </Accordion>
        </div>
      </nav >
    </>
  );
}

export default DesignerSidebar;
