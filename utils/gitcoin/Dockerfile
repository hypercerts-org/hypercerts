FROM python
CMD /bin/bash

# Install dependencies
RUN mkdir -p /install/
COPY requirements.txt /install/
RUN pip install -r /install/requirements.txt
