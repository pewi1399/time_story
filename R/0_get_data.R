rm(list = ls())
library(dplyr)
library(openxlsx)
library(ggplot2)
library(tidyr)


if(FALSE){
  # list all files
  xlsx_files <- list.files("data/") %>% grep("^Fondandelskurser.*xlsx$", ., value = TRUE)
  
  #function for reading in sheets 
  read_sheet <- function(file, sheetindex){
    #file <- xlsx_files[8]
    # sheetindex <- 2
    #tmp <- readxl::read_excel(paste0("data/", file), sheet = sheetindex)
    tmp <- openxlsx::read.xlsx(paste0("data/", file), sheet = sheetindex)
    tmp$Datum <- openxlsx::convertToDate(tmp$Datum)
    tmp[,] = lapply(tmp[,], as.character)
    print(tmp$Datum[4])
    return(tmp)
  }
  
  #functionf for rerading in a list of year files
  read_funds <- function(file){
    print(file)
    # loop over first 4 sheets
    if(grepl("2017", file)){
      ll <- lapply(1:3, function(x){ read_sheet(file,x)})
    } else{
      ll <- lapply(1:4, function(x){ read_sheet(file,x)})
    }
  
    # keep allra  
    tmp <- bind_rows(ll) %>% 
        filter(Fondnummer %in% c(250340, 123679, 286179 ))
    
    return(tmp)
  }
  
  # run and record records that we wish to keep
  year_list <- lapply(xlsx_files, read_funds)
  dat <- bind_rows(year_list)
  
  saveRDS(dat, "data/allra_kurs.rds")
} else {
  dat <- readRDS("data/allra_kurs.rds")
}


dat$given_name <- ifelse(dat$Fondnummer == 250340, "Allra_Strategi_Modig",
                         ifelse(dat$Fondnummer == 286179 , "Allra_Strategi_Lagom", "Handelsbanken_Global"
                         )
                         )

dat$price <- as.numeric(dat$Fondkurs.sälj)

# read in alternative indeces
omxs <- read.csv("Data/OMXS.csv", stringsAsFactors = FALSE)
omxs <-
  omxs %>% 
  select(Datum, Senaste) %>% 
  rename(price = Senaste) %>% 
  mutate(
        given_name = "OMXS",
        price = gsub("\\.", "", price),
        price = as.numeric(gsub(",", "\\.", price))
         )

sp <- read.csv("Data/SP500.csv", stringsAsFactors = FALSE)
sp <-
  sp %>% 
  select(Datum, Senaste) %>% 
  rename(price = Senaste) %>% 
  mutate(
    given_name = "S&P500",
    price = gsub("\\.", "", price),
    price = as.numeric(gsub(",", "\\.", price))
  )

dat <- bind_rows(dat, omxs)
dat <- bind_rows(dat, sp)

dat <- 
  dat %>% 
   # mutate(date = as.numeric(Datum)) %>% 
    arrange(Datum)

# pick an index date (the first) 
indexdate <- 
  dat %>% 
  #filter(as.Date(Datum) >= as.Date("2011-09-01")) %>% 
  filter(as.Date(Datum) >= as.Date("2012-10-31")) %>% 
  filter(!duplicated(given_name)) %>%
  select(given_name, price) %>% 
  rename(min_price = price)

plot_data <- merge(dat, indexdate, by = "given_name") %>% 
  #filter(as.Date(Datum) >= as.Date("2011-09-01")) %>% 
  filter(as.Date(Datum) >= as.Date("2012-10-31")) %>% 
  mutate(index = (price/min_price)*100,
         Date = as.Date(Datum)
         )

  
ggplot(plot_data)+
  aes(x = Date, y = index, group = given_name, col = given_name)+
  geom_line()


out <-
  plot_data %>% 
  select(index, Date, given_name) %>% 
  gather(key, value, -Date, -given_name) %>% 
  select(-key) %>% 
  spread(given_name, value)
  
writeLines(paste0("var indexdata = ", jsonlite::toJSON(out)), "data/indexdata.js")
  