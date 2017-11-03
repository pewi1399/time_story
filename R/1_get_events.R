rm(list = ls())
library(dplyr)
library(openxlsx)
library(ggplot2)
library(tidyr)

events <- openxlsx::read.xlsx("data/Exempel_case_allra.xlsx", sheet = 1)

out <- 
events %>% 
  mutate(date = openxlsx::convertToDate(time)) %>% 
  filter(date > as.Date("2011-09-01") & !is.na(date)) %>% 
  select(-time)

#out <- out[sample(1:nrow(out)), ]

writeLines(paste0("var eventdata = ", jsonlite::toJSON(out)), "data/eventdata.js")
